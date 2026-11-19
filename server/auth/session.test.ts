import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireSession } from "./session";

// session.ts is server-only and talks to Better Auth and Next's request
// APIs; replace each so the test controls the session and sees redirects.
vi.mock("server-only", () => {
  return {};
});
const { getSessionApi, redirect } = vi.hoisted(() => {
  return {
    getSessionApi: vi.fn(),
    // Like Next's redirect(), stop the function by throwing.
    redirect: vi.fn((url: string) => {
      throw new Error(`redirect:${url}`);
    }),
  };
});
vi.mock("@/server/auth/config", () => {
  return { auth: { api: { getSession: getSessionApi } } };
});
vi.mock("next/headers", () => {
  return { headers: async () => new Headers() };
});
vi.mock("next/navigation", () => {
  return { redirect };
});

beforeEach(() => {
  getSessionApi.mockReset();
  redirect.mockClear();
});

describe("requireSession", () => {
  it("returns the session when the database finds one", async () => {
    const session = { user: { name: "Dinobyte#11311" }, session: {} };
    getSessionApi.mockResolvedValue(session);

    await expect(requireSession("/account")).resolves.toBe(session);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to sign in, coming back to the page, when there's none", async () => {
    getSessionApi.mockResolvedValue(null);

    await expect(requireSession("/account")).rejects.toThrow(
      "redirect:/sign-in?callbackURL=%2Faccount",
    );
  });
});
