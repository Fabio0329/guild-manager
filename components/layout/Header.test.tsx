import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { site } from "@/lib/site";
import { axe } from "@/test/vitest/axe";
import { Header } from "./Header";

// UserMenu reads the session on the server; it has its own test. Here a
// stand-in keeps the header test about the header.
vi.mock("@/components/auth/UserMenu", () => {
  return { UserMenu: () => <span>Account area</span> };
});

describe("Header", () => {
  it("links the site name to the home page", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: site.name })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Header />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
