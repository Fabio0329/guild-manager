"use client";

import type { FC } from "react";
import { authClient } from "@/lib/auth-client";

// Provider IDs as configured in server/auth.ts, with their display names.
const providerNames = {
  battlenet: "Battle.net",
  discord: "Discord",
} as const;

type SignInButtonProps = {
  provider: keyof typeof providerNames;
};

// Starts a sign-in: our server builds the authorize URL (with state, nonce,
// and the PKCE challenge) and the browser follows it.
export const SignInButton: FC<SignInButtonProps> = ({ provider }) => {
  const handleClick = async () => {
    await authClient.signIn.social({ provider, callbackURL: "/" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md border border-border px-3 py-1.5 hover:bg-surface"
    >
      Sign in with {providerNames[provider]}
    </button>
  );
};
