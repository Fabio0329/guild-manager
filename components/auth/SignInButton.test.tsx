import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "@/test/vitest/axe";
import { SignInButton } from "./SignInButton";

// Replace the real auth client so clicking doesn't try to reach a server.
// vi.hoisted makes the mock available to the vi.mock factory, which Vitest
// moves above the imports.
const { signInSocial } = vi.hoisted(() => {
  return { signInSocial: vi.fn() };
});
vi.mock("@/lib/auth-client", () => {
  return { authClient: { signIn: { social: signInSocial } } };
});

describe("SignInButton", () => {
  it("starts a Battle.net sign-in that returns to the home page", async () => {
    const user = userEvent.setup();
    render(<SignInButton />);

    await user.click(
      screen.getByRole("button", { name: "Sign in with Battle.net" }),
    );

    expect(signInSocial).toHaveBeenCalledWith({
      provider: "battlenet",
      callbackURL: "/",
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SignInButton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
