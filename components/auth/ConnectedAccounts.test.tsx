import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "@/test/vitest/axe";
import { ConnectedAccounts } from "./ConnectedAccounts";

// Stand-ins for the server session, the account list, and the browser auth
// client, so each test decides who's signed in with which providers.
const { getSession, listAccounts } = vi.hoisted(() => {
  return { getSession: vi.fn(), listAccounts: vi.fn() };
});
vi.mock("@/server/auth/session", () => {
  return { getSession };
});
vi.mock("@/server/auth/accounts", () => {
  return { listAccounts };
});
vi.mock("@/lib/auth/client", () => {
  return {
    authClient: {
      signIn: { social: vi.fn() },
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
  getSession.mockReset();
  listAccounts.mockReset();
});

describe("ConnectedAccounts", () => {
  it("asks to sign in when signed out, without listing accounts", async () => {
    getSession.mockResolvedValue(null);
    await renderAccounts();

    expect(screen.getByText(/sign in to manage/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in with Battle.net" }),
    ).toBeInTheDocument();
    expect(listAccounts).not.toHaveBeenCalled();
  });

  it("offers to connect the missing provider, never to remove the only one", async () => {
    getSession.mockResolvedValue(signedIn);
    listAccounts.mockResolvedValue([battlenet]);
    await renderAccounts();

    expect(
      screen.getByRole("button", { name: "Connect Discord" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Your only way to sign in")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /disconnect/i })).toBeNull();
  });

  it("offers to disconnect either one when both are connected", async () => {
    getSession.mockResolvedValue(signedIn);
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
    getSession.mockResolvedValue(signedIn);
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
    { state: "signed out", session: null, accounts: [] },
    { state: "one account", session: signedIn, accounts: [battlenet] },
    {
      state: "both accounts",
      session: signedIn,
      accounts: [battlenet, discord],
    },
  ])(
    "has no accessibility violations with $state",
    async ({ session, accounts }) => {
      getSession.mockResolvedValue(session);
      listAccounts.mockResolvedValue(accounts);
      const { container } = await renderAccounts();
      expect(await axe(container)).toHaveNoViolations();
    },
  );
});
