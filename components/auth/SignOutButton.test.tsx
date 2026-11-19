import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "@/test/vitest/axe";
import { SignOutButton } from "./SignOutButton";

const { signOut, refresh } = vi.hoisted(() => {
  return { signOut: vi.fn(), refresh: vi.fn() };
});
vi.mock("@/lib/auth/client", () => {
  return { authClient: { signOut } };
});
vi.mock("next/navigation", () => {
  return { useRouter: () => ({ refresh }) };
});

describe("SignOutButton", () => {
  it("signs out, then refreshes the page's server components", async () => {
    const user = userEvent.setup();
    render(<SignOutButton />);

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(signOut).toHaveBeenCalledOnce();
    expect(refresh).toHaveBeenCalledOnce();
    // Refresh only after sign-out finished, or the header would still see
    // the old session.
    expect(signOut.mock.invocationCallOrder[0]).toBeLessThan(
      refresh.mock.invocationCallOrder[0],
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SignOutButton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
