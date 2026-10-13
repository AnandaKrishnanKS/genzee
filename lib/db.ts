import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  // If DATABASE_URL is not set (e.g. during Vercel build time), avoid crashing
  if (!process.env.DATABASE_URL) {
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "$transaction") {
          return () => Promise.reject(new Error("DATABASE_URL not configured"));
        }
        return new Proxy({}, {
          get() {
            return () => Promise.reject(new Error("DATABASE_URL not configured"));
          },
        });
      },
    });
  }

  try {
    const client = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
    return client;
  } catch (err) {
    console.warn("Prisma Client initialization skipped:", err);
    return new Proxy({} as PrismaClient, {
      get() {
        return () => Promise.reject(new Error("DATABASE_URL not configured"));
      },
    });
  }
}

export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
