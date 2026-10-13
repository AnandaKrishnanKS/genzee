import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createSafeFallbackProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_target, prop) {
      if (prop === "$transaction") {
        return () => Promise.reject(new Error("Database not connected"));
      }
      return new Proxy({}, {
        get() {
          return () => Promise.reject(new Error("Database not connected"));
        },
      });
    },
  });
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const dbUrl = process.env.DATABASE_URL;

  // In production (like Vercel), if DATABASE_URL is missing, dummy, or points to localhost,
  // do not try to initialize Prisma - smoothly fall back to our local data store.
  if (
    !dbUrl ||
    dbUrl.includes("localhost") ||
    dbUrl.includes("username:password@host") ||
    dbUrl.includes("dummy")
  ) {
    return createSafeFallbackProxy();
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
    return createSafeFallbackProxy();
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
