import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import type { Theme } from "@/lib/theme";
import { presetTheme, themes } from "./helpers";
import { publicRoutes, signedInRoutes } from "./routes";
import { signInAsNewUser } from "./test-auth";

// WCAG 2.1 AA, the site's standard. Same tags as the component tests, but
// here axe sees real CSS, so color contrast is checked too.
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

// Signed in, public pages look different (the header shows the user and
// Sign out), and protected pages can only be checked this way.
const checkPages = async (page: Page, theme: Theme, paths: string[]) => {
  for (const path of paths) {
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
};

for (const theme of themes) {
  test(`every page meets WCAG 2.1 AA in ${theme} mode`, async ({ page }) => {
    await presetTheme(page, theme);
    await checkPages(page, theme, publicRoutes);
  });

  test(`every page meets WCAG 2.1 AA in ${theme} mode, signed in`, async ({
    page,
    context,
  }) => {
    await signInAsNewUser(context);
    await presetTheme(page, theme);
    await checkPages(page, theme, signedInRoutes);
  });
}

test("no page scrolls sideways, signed out or in", async ({
  page,
  context,
}) => {
  const check = async (paths: string[]) => {
    for (const path of paths) {
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
  };

  await check(publicRoutes);
  await signInAsNewUser(context);
  await check(signedInRoutes);
});
