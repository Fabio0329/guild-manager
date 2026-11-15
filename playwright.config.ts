import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const isCI = Boolean(process.env.CI);

// Page-level tests against a real production build, in a real browser.
// See test/e2e/ for the specs.
export default defineConfig({
  testDir: "test/e2e",
  fullyParallel: true,
  // Fail CI if a test.only was left in by accident.
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
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
    url: `http://localhost:${port}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
