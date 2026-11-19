import { defineConfig, devices } from "@playwright/test";
import { baseURL, e2eEnv, port } from "./test/e2e/env";

const isCI = Boolean(process.env.CI);

// Page-level tests against a real production build, in a real browser.
// See test/e2e/ for the specs.
export default defineConfig({
  testDir: "test/e2e",
  // Creates, migrates, and empties the test database before the run.
  globalSetup: "./test/e2e/global-setup.ts",
  fullyParallel: true,
  // Fail CI if a test.only was left in by accident.
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    // Keep a step-by-step recording of failed tests (npx playwright show-trace).
    trace: "retain-on-failure",
  },
  // Every test runs once per project.
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // WCAG 2.1 Reflow (1.4.10): content must work at 320 CSS px wide.
    {
      name: "reflow",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 640 },
      },
    },
  ],
  // Build and start the app before the tests, and stop it after.
  webServer: {
    command: `npm run build && npx next start -p ${port}`,
    url: baseURL,
    // Test database and test secret; these override .env.local.
    env: e2eEnv,
    // Always start a fresh server: one left over from something else could
    // be pointed at the dev database instead of the test one.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
