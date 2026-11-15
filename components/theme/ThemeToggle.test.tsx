import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { axe } from "@/test/axe";
import { ThemeToggle } from "./ThemeToggle";

// The head script sets data-theme in the real app; set it by hand here.
beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute("data-theme", "light");
});

// jsdom loads no CSS, so both sr-only labels are "visible" here and the
// button's name contains both. Which label shows is checked in the page tests.
const getToggle = () => screen.getByRole("button", { name: /switch to/i });

describe("ThemeToggle", () => {
  it("switches between light and dark and remembers the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(getToggle());
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    await user.click(getToggle());
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ThemeToggle />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
