import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolve the "@/..." import alias from tsconfig.json.
  resolve: { tsconfigPaths: true },
  test: {
    // A simulated browser (DOM, localStorage, events) inside Node.
    environment: "jsdom",
    setupFiles: ["./test/vitest/setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    // e2e/ holds Playwright page tests (step 7), which Vitest must not run.
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
  },
});
