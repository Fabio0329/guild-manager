import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "@/test/vitest/axe";
import { DisconnectAccountButton } from "./DisconnectAccountButton";

const { unlinkAccount, refresh } = vi.hoisted(() => {
  return { unlinkAccount: vi.fn(), refresh: vi.fn() };
});
vi.mock("@/lib/auth/client", () => {
  return { authClient: { unlinkAccount } };
});
vi.mock("next/navigation", () => {
  return { useRouter: () => ({ refresh }) };
});

describe("DisconnectAccountButton", () => {
  it("unlinks that account row, then refreshes the list", async () => {
    const user = userEvent.setup();
    render(
      <DisconnectAccountButton provider="discord" accountId="acc-discord" />,
    );

    await user.click(
      screen.getByRole("button", { name: "Disconnect Discord" }),
    );

    expect(unlinkAccount).toHaveBeenCalledWith({ accountId: "acc-discord" });
    expect(unlinkAccount.mock.invocationCallOrder[0]).toBeLessThan(
      refresh.mock.invocationCallOrder[0],
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <DisconnectAccountButton provider="discord" accountId="acc-discord" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
