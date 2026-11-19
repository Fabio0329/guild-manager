import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "@/test/vitest/axe";
import { ConnectedAccounts } from "./ConnectedAccounts";

// Stand-ins for the server session, the account list, and the browser auth
// client, so each test decides who's signed in with which providers.
const { requireSession, listAccounts } = vi.hoisted(() => {
  return { requireSession: vi.fn(), listAccounts: vi.fn() };
});
vi.mock("@/server/auth/session", () => {
  return { requireSession };
});
vi.mock("@/server/auth/accounts", () => {
  return { listAccounts };
});
vi.mock("@/lib/auth/client", () => {
  return {
    authClient: {
      linkSocial: vi.fn(),
      unlinkAccount: vi.fn(),
    },
  };
});
vi.mock("next/navigation", () => {
  return { useRouter: () => ({ refresh: vi.fn() }) };
});

const signedIn = { user: { name: "Dinobyte#11311" }, session: {} };
const battlenet = { id: "acc-bnet", providerId: "battlenet" };
const discord = { id: "acc-discord", providerId: "discord" };

const renderAccounts = async (error?: string) => {
  return render(await ConnectedAccounts({ error }));
};

beforeEach(() => {
  requireSession.mockReset();
  requireSession.mockResolvedValue(signedIn);
  listAccounts.mockReset();
});

describe("ConnectedAccounts", () => {
  it("requires a session, coming back to /account after sign-in", async () => {
    listAccounts.mockResolvedValue([battlenet]);
    await renderAccounts();
    expect(requireSession).toHaveBeenCalledWith("/account");
  });

  it("offers to connect the missing provider, never to remove the only one", async () => {
    listAccounts.mockResolvedValue([battlenet]);
    await renderAccounts();

    expect(
      screen.getByRole("button", { name: "Connect Discord" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Your only way to sign in")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /disconnect/i })).toBeNull();
  });

  it("offers to disconnect either one when both are connected", async () => {
    listAccounts.mockResolvedValue([battlenet, discord]);
    await renderAccounts();

    expect(
      screen.getByRole("button", { name: "Disconnect Battle.net" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Disconnect Discord" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^connect/i })).toBeNull();
  });

  it("explains a known linking error, and names an unknown one", async () => {
    listAccounts.mockResolvedValue([battlenet]);

    const { unmount } = await renderAccounts(
      "account_already_linked_to_different_user",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      /already belongs to a different Guild Manager user/,
    );
    unmount();

    await renderAccounts("something_new");
    expect(screen.getByRole("alert")).toHaveTextContent("(something_new)");
  });

  it.each([
    { state: "one account", accounts: [battlenet] },
    { state: "both accounts", accounts: [battlenet, discord] },
  ])("has no accessibility violations with $state", async ({ accounts }) => {
    listAccounts.mockResolvedValue(accounts);
    const { container } = await renderAccounts();
    expect(await axe(container)).toHaveNoViolations();
  });
});
