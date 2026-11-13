"use client";

import type { FC } from "react";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { SunIcon } from "@/components/icons/SunIcon";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export const ThemeToggle: FC = () => {
  const handleClick = () => {
    // data-theme on <html> is the source of truth; the head script set it.
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const toggledTheme: Theme = currentTheme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, toggledTheme);
    } catch {}
    document.documentElement.setAttribute("data-theme", toggledTheme);
  };

  // The server can't know the theme, so both labels and icons render and CSS
  // (the dark: variant) shows the right pair. Server and client markup match,
  // and display:none removes the hidden label from the accessibility tree.
  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      <span className="sr-only dark:hidden">Switch to dark theme</span>
      <span className="sr-only hidden dark:inline">Switch to light theme</span>
      <MoonIcon className="size-5 dark:hidden" />
      <SunIcon className="hidden size-5 dark:block" />
    </button>
  );
};
