import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { presetTheme, themes } from "./helpers";
import { publicRoutes } from "./routes";

// WCAG 2.1 AA, the site's standard. Same tags as the component tests, but
// here axe sees real CSS, so color contrast is checked too.
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const theme of themes) {
  test(`every page meets WCAG 2.1 AA in ${theme} mode`, async ({ page }) => {
    await presetTheme(page, theme);

    for (const path of publicRoutes) {
      await test.step(path, async () => {
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

        const { violations } = await new AxeBuilder({ page })
          .withTags(wcagTags)
          .analyze();

        // Soft, so one run reports every failing page, not just the first.
        // The mapped summary names the rule and the offending elements.
        expect
          .soft(
            violations.map(({ id, impact, help, nodes }) => ({
              id,
              impact,
              help,
              elements: nodes.map((node) => node.target.join(" ")),
            })),
            `axe violations on ${path}`,
          )
          .toEqual([]);
      });
    }
  });
}

test("no page scrolls sideways", async ({ page }) => {
  for (const path of publicRoutes) {
    await test.step(path, async () => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect
        .soft(overflow, `horizontal overflow on ${path}`)
        .toBeLessThanOrEqual(0);
    });
  }
});
