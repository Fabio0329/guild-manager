import { configureAxe } from "vitest-axe";

// WCAG 2.1 AA rules only. Best-practice rules like "region" are left out
// because they only make sense for a full page, not a component rendered on
// its own. jsdom has no layout or CSS, so color contrast is checked by
// app/theme-contrast.test.ts and the page tests instead.
export const axe = configureAxe({
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
  },
});
