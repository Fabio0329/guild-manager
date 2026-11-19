// A test-only Better Auth instance with the testUtils plugin, pointed at the
// test database with the test server's secret. testUtils creates real
// sessions and signed cookies without a provider sign-in, so it's
// privileged: it lives here, never in server/auth/config.ts.
//
// It talks to Postgres through a plain `pg` pool rather than our Prisma
// client: Prisma 7's generated client is an ES module, which Playwright's
// CommonJS test loader can't import. Better Auth's default table and column
// names match the tables our migrations created.
import { randomUUID } from "node:crypto";
import type { BrowserContext } from "@playwright/test";
import { betterAuth } from "better-auth";
import { testUtils } from "better-auth/plugins";
import { Pool } from "pg";
import { e2eEnv } from "./env";

const pool = new Pool({ connectionString: e2eEnv.DATABASE_URL });

const testAuth = betterAuth({
  secret: e2eEnv.BETTER_AUTH_SECRET,
  baseURL: e2eEnv.BETTER_AUTH_URL,
  database: pool,
  plugins: [testUtils()],
});

/**
 * Creates a user with a Battle.net account, signs them in, and puts the
 * signed session cookie in the browser: the same state a real sign-in
 * leaves, minus the trip to Battle.net. Each call makes a new user, so
 * tests running in parallel don't share state.
 */
export const signInAsNewUser = async (context: BrowserContext) => {
  const ctx = await testAuth.$context;
  const id = randomUUID();
  const user = await ctx.test.saveUser(
    ctx.test.createUser({
      name: `Tester#${id.slice(0, 4)}`,
      email: `battlenet-e2e-${id}@users.invalid`,
    }),
  );
  await ctx.internalAdapter.createAccount({
    userId: user.id,
    providerId: "battlenet",
    accountId: `e2e-${id}`,
  });
  const { cookies } = await ctx.test.login({ userId: user.id });
  await context.addCookies(cookies);
  return user;
};

/** Reads straight from the test database, to check what the app saved. */
export const testDb = {
  roleOf: async (userId: string) => {
    const { rows } = await pool.query<{ role: string }>(
      'SELECT role FROM "user" WHERE id = $1',
      [userId],
    );
    return rows[0]?.role;
  },
  sessionCount: async (userId: string) => {
    const { rows } = await pool.query<{ count: string }>(
      'SELECT count(*) FROM session WHERE "userId" = $1',
      [userId],
    );
    return Number(rows[0]?.count);
  },
};
