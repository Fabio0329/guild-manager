import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AccountDetails } from "./AccountDetails";

// Stand-in for the account list: shows which error it was given.
vi.mock("@/components/auth/ConnectedAccounts", () => {
  return {
    ConnectedAccounts: ({ error }: { error?: string }) => {
      return <p>error: {error ?? "none"}</p>;
    },
  };
});

const renderWith = async (params: { error?: string | string[] }) => {
  return render(
    await AccountDetails({ searchParams: Promise.resolve(params) }),
  );
};

describe("AccountDetails", () => {
  it.each([
    { label: "a single ?error", params: { error: "x" }, shown: "error: x" },
    { label: "no ?error", params: {}, shown: "error: none" },
    {
      label: "a repeated ?error (an array)",
      params: { error: ["x", "y"] },
      shown: "error: none",
    },
  ])("passes on $label correctly", async ({ params, shown }) => {
    await renderWith(params);
    expect(screen.getByText(shown)).toBeInTheDocument();
  });
});
