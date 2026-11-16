import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// The Prisma CLI doesn't read .env.local (Next.js does), so load it here.
// Real environment variables, as on a host or in CI, still take priority.
config({ path: ".env.local", quiet: true });

// Configuration for the Prisma CLI: migrate, generate, studio.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL lets a host with a connection pooler give migrations a
    // direct connection; locally only DATABASE_URL is set.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
