import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "ADMIN";
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        // Lazy import to avoid edge runtime issues
        try {
          const { db } = await import("@/lib/db");
          const admin = await db.adminUser.findUnique({
            where: { email: parsed.data.email },
          });

          if (admin) {
            const valid = await bcrypt.compare(
              parsed.data.password,
              admin.hashedPassword
            );
            if (valid) {
              return {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
              };
            }
          }
        } catch (dbErr) {
          // If DB is offline or unreachable, fall back to data store
        }

        const { loadDataStore } = await import("@/lib/data-store");
        const store = loadDataStore();
        if (
          store.admin &&
          store.admin.email.toLowerCase() === parsed.data.email.toLowerCase()
        ) {
          const valid = await bcrypt.compare(
            parsed.data.password,
            store.admin.hashedPassword
          );
          if (valid) {
            return {
              id: store.admin.id,
              email: store.admin.email,
              name: store.admin.name,
              role: store.admin.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
};
