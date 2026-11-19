import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "@/test/vitest/axe";
import { UserMenu } from "./UserMenu";

// Stand-ins for the server session and the browser auth client, so the test
// controls who's "signed in" and nothing reaches a server.
const { getSession } = vi.hoisted(() => {
  return { getSession: vi.fn() };
});
vi.mock("@/server/session", () => {
  return { getSession };
});
vi.mock("@/lib/auth-client", () => {
  return { authClient: { signIn: { social: vi.fn() }, signOut: vi.fn() } };
});
vi.mock("next/navigation", () => {
  return { useRouter: () => ({ refresh: vi.fn() }) };
});

// UserMenu is an async server component: await it to get the markup, then
// render that.
const renderUserMenu = async () => {
  return render(await UserMenu({}));
};

const signedIn = (image: string | null) => {
  return { user: { name: "DinoByte", image }, session: {} };
};

beforeEach(() => {
  getSession.mockReset();
});

describe("UserMenu", () => {
  it("offers both sign-in buttons when signed out", async () => {
    getSession.mockResolvedValue(null);
    await renderUserMenu();

    expect(
      screen.getByRole("button", { name: "Sign in with Battle.net" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign out" })).toBeNull();
  });

  it("shows the user's name and a sign-out button when signed in", async () => {
    getSession.mockResolvedValue(
      signedIn("https://cdn.discordapp.com/avatars/1/a.png"),
    );
    await renderUserMenu();

    expect(screen.getByText("DinoByte")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign out" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sign in/i })).toBeNull();
  });

  it("works without an avatar (Battle.net users have none)", async () => {
    getSession.mockResolvedValue(signedIn(null));
    const { container } = await renderUserMenu();

    expect(screen.getByText("DinoByte")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });

  it.each([
    { state: "signed out", session: null },
    {
      state: "signed in",
      session: signedIn("https://cdn.discordapp.com/avatars/1/a.png"),
    },
  ])("has no accessibility violations when $state", async ({ session }) => {
    getSession.mockResolvedValue(session);
    const { container } = await renderUserMenu();
    expect(await axe(container)).toHaveNoViolations();
  });
});
