import { expect, test } from "@playwright/test";
import { presetTheme } from "./helpers";

test("the skip link is the first tab stop and jumps to the content", async ({
  page,
}) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#content$/);
});

test("the theme toggle works from the keyboard and names its action", async ({
  page,
}) => {
  await presetTheme(page, "light");
  await page.goto("/");
  const html = page.locator("html");

  // In light mode the button offers dark, and vice versa. Only a real browser
  // applies the CSS that hides the other label, so this can't be a unit test.
  const toDark = page.getByRole("button", { name: "Switch to dark theme" });
  await toDark.focus();
  await page.keyboard.press("Enter");
  await expect(html).toHaveAttribute("data-theme", "dark");

  const toLight = page.getByRole("button", { name: "Switch to light theme" });
  await expect(toLight).toBeFocused();
  await page.keyboard.press("Space");
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(toDark).toBeFocused();
});

test("keyboard focus is visible", async ({ page }) => {
  await page.goto("/");
  // Past the skip link, onto the first header control.
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  const outline = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement as Element);
    return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
  });
  expect(outline.style).not.toBe("none");
  expect(outline.width).toBeGreaterThan(0);
});
