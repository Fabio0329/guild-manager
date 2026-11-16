// Fails the build if a client component imports this file, so database code
// and credentials can never be bundled for the browser.
import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/server/env";
import { PrismaClient } from "@/server/generated/prisma/client";

// One client per process. In dev, hot reload re-runs this module, so the
// client is cached on globalThis to avoid opening a new pool on every edit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 talks to Postgres through a driver adapter; this one uses `pg`.
const createPrismaClient = () => {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
