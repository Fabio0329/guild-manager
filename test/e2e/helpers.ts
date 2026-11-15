import type { Page } from "@playwright/test";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export const themes: Theme[] = ["light", "dark"];

/** Make every page load in the given theme, before any page script runs. */
export const presetTheme = async (page: Page, theme: Theme) => {
  // The script runs inside the browser and can't see these variables, so
  // they're passed in as its one argument: a [key, value] pair.
  const storageEntry = [THEME_STORAGE_KEY, theme] as const;

  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, value),
    storageEntry,
  );
};
