import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "@/test/vitest/axe";
import { ConnectAccountButton } from "./ConnectAccountButton";

const { linkSocial } = vi.hoisted(() => {
  return { linkSocial: vi.fn() };
});
vi.mock("@/lib/auth-client", () => {
  return { authClient: { linkSocial } };
});

describe("ConnectAccountButton", () => {
  it("links the provider and comes back to the account page, also on errors", async () => {
    const user = userEvent.setup();
    render(<ConnectAccountButton provider="discord" />);

    await user.click(screen.getByRole("button", { name: "Connect Discord" }));

    expect(linkSocial).toHaveBeenCalledWith({
      provider: "discord",
      callbackURL: "/account",
      errorCallbackURL: "/account",
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ConnectAccountButton provider="discord" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
