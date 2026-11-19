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
vi.mock("@/lib/auth/client", () => {
  return { authClient: { signIn: { social: signInSocial } } };
});

const providers = [
  { provider: "battlenet", label: "Sign in with Battle.net" },
  { provider: "discord", label: "Sign in with Discord" },
] as const;

describe.each(providers)(
  "SignInButton for $provider",
  ({ provider, label }) => {
    it("starts that provider's sign-in, returning to the home page", async () => {
      const user = userEvent.setup();
      render(<SignInButton provider={provider} />);

      await user.click(screen.getByRole("button", { name: label }));

      expect(signInSocial).toHaveBeenCalledWith({ provider, callbackURL: "/" });
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<SignInButton provider={provider} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  },
);
