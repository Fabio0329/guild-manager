import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "@/test/vitest/axe";
import { SignInOptions } from "./SignInOptions";

const { getSession, redirect, signInSocial } = vi.hoisted(() => {
  return {
    getSession: vi.fn(),
    redirect: vi.fn((url: string) => {
      throw new Error(`redirect:${url}`);
    }),
    signInSocial: vi.fn(),
  };
});
vi.mock("@/server/auth/session", () => {
  return { getSession };
});
vi.mock("next/navigation", () => {
  return { redirect };
});
vi.mock("@/lib/auth/client", () => {
  return { authClient: { signIn: { social: signInSocial } } };
});

const renderWith = async (params: { callbackURL?: string }) => {
  return render(await SignInOptions({ searchParams: Promise.resolve(params) }));
};

beforeEach(() => {
  getSession.mockReset();
  signInSocial.mockClear();
  redirect.mockClear();
});

describe("SignInOptions", () => {
  it("signs in and returns to the page that asked", async () => {
    getSession.mockResolvedValue(null);
    const user = userEvent.setup();
    await renderWith({ callbackURL: "/account" });

    await user.click(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    );

    expect(signInSocial).toHaveBeenCalledWith({
      provider: "discord",
      callbackURL: "/account",
    });
  });

  it("ignores a return address on another site (open redirect)", async () => {
    getSession.mockResolvedValue(null);
    const user = userEvent.setup();
    await renderWith({ callbackURL: "https://evil.example" });

    await user.click(
      screen.getByRole("button", { name: "Sign in with Battle.net" }),
    );

    expect(signInSocial).toHaveBeenCalledWith({
      provider: "battlenet",
      callbackURL: "/",
    });
  });

  it("sends someone already signed in straight on", async () => {
    getSession.mockResolvedValue({ user: {}, session: {} });

    await expect(renderWith({ callbackURL: "/account" })).rejects.toThrow(
      "redirect:/account",
    );
  });

  it("has no accessibility violations", async () => {
    getSession.mockResolvedValue(null);
    const { container } = await renderWith({});
    expect(await axe(container)).toHaveNoViolations();
  });
});
