"use client";

import type { FC } from "react";
import { authClient } from "@/lib/auth-client";

// Starts the Battle.net sign-in: our server builds the authorize URL (with
// state, nonce, and the PKCE challenge) and the browser follows it.
export const SignInButton: FC = () => {
  const handleClick = async () => {
    await authClient.signIn.social({ provider: "battlenet", callbackURL: "/" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md border border-border px-3 py-1.5 hover:bg-surface"
    >
      Sign in with Battle.net
    </button>
  );
};
