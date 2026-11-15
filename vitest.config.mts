import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolve the "@/..." import alias from tsconfig.json.
  resolve: { tsconfigPaths: true },
  test: {
    // A simulated browser (DOM, localStorage, events) inside Node.
    environment: "jsdom",
    setupFiles: ["./test/vitest/setup.ts"],
    // Unit tests sit next to the code they test.
    include: ["**/*.test.{ts,tsx}"],
    // test/e2e/ holds Playwright page tests, which Vitest must not run.
    exclude: ["node_modules/**", ".next/**", "test/e2e/**"],
  },
});
