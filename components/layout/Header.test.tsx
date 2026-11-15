import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/lib/site";
import { axe } from "@/test/axe";
import { Header } from "./Header";

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
