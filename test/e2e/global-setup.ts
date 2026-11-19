// Runs once before the page tests: makes sure the test database exists, has
// every migration applied, and starts empty.
import { execFileSync } from "node:child_process";
import { Client } from "pg";
import { testDatabaseUrl } from "./env";

const createDatabaseIfMissing = async () => {
  const url = new URL(testDatabaseUrl);
  const name = url.pathname.slice(1);
  // CREATE DATABASE has to run while connected to a different database.
  url.pathname = "/postgres";
  const admin = new Client({ connectionString: url.toString() });
  await admin.connect();
  try {
    const { rowCount } = await admin.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [name],
    );
    if (rowCount === 0) {
      // Identifiers can't be query parameters; the name comes from our own
      // config, and quoting keeps it a single identifier.
      await admin.query(`CREATE DATABASE "${name.replaceAll('"', '""')}"`);
    }
  } finally {
    await admin.end();
  }
};

const globalSetup = async () => {
  await createDatabaseIfMissing();

  // The production-style command: applies committed migrations, never
  // creates new ones, never resets.
  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
    stdio: "inherit",
  });

  // Start every run from an empty database. CASCADE also empties the tables
  // that point at user (session, account).
  const db = new Client({ connectionString: testDatabaseUrl });
  await db.connect();
  try {
    await db.query('TRUNCATE "user", verification CASCADE');
  } finally {
    await db.end();
  }
};

export default globalSetup;
