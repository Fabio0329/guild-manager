// Settings for the page tests. The test server and the test-only auth
// instance (test-auth.ts) both use these, so cookies signed by one are
// accepted by the other. They replace .env.local's values, so local runs and
// CI behave the same and the tests never touch your dev database.

export const port = 3100;
export const baseURL = `http://localhost:${port}`;

// A separate database in the same Postgres: global-setup.ts creates it,
// applies the migrations, and empties it before each run.
export const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ??
  "postgresql://guild_manager:guild_manager@localhost:5433/guild_manager_test";

export const e2eEnv = {
  DATABASE_URL: testDatabaseUrl,
  // Test-only: signs the session cookies the tests create. Not a real secret.
  BETTER_AUTH_SECRET: "e2e-test-secret-not-used-anywhere-real",
  BETTER_AUTH_URL: baseURL,
  // The tests never reach Battle.net or Discord.
  BATTLENET_CLIENT_ID: "e2e-placeholder",
  BATTLENET_CLIENT_SECRET: "e2e-placeholder",
  DISCORD_CLIENT_ID: "0",
  DISCORD_CLIENT_SECRET: "e2e-placeholder",
};
