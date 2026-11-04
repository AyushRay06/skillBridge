import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Executes a Prisma operation with automatic retry for Neon cold-start errors (P1001).
 * Neon free-tier databases auto-suspend and may take a few seconds to wake up.
 */
export async function withRetry(fn, { retries = 3, delayMs = 1500 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isConnErr =
        err?.code === "P1001" ||
        err?.code === "P1002" ||
        (err?.message && err.message.includes("Can't reach database"));
      if (isConnErr && attempt < retries) {
        console.warn(
          `[Prisma] DB connection failed (attempt ${attempt}/${retries}), retrying in ${delayMs}ms…`
        );
        await new Promise((r) => setTimeout(r, delayMs));
        // Try to reconnect
        try {
          await prisma.$connect();
        } catch (_) {
          // ignore reconnect error, let the next query attempt handle it
        }
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

export default prisma;

