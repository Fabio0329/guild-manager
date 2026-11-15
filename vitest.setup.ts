// Runs before every test file.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";

// Adds expect(...).toHaveNoViolations() for axe results.
expect.extend(axeMatchers);

// jsdom has no canvas. axe-core asks for one and copes with null, but jsdom
// logs "Not implemented" on every call. Return null quietly instead.
HTMLCanvasElement.prototype.getContext = () => null;

// Unmount whatever a test rendered so the next test starts from an empty page.
afterEach(() => {
  cleanup();
});
