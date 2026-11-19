"use client";

import type { FC } from "react";
import { authClient } from "@/lib/auth-client";
import { type ProviderId, providerNames } from "@/lib/providers";

type ConnectAccountButtonProps = {
  provider: ProviderId;
};

// Links another provider to the signed-in user: the same redirect flow as
// sign-in (state, nonce, PKCE), but the result is attached to this session's
// user instead of signing anyone in. Errors come back as /account?error=…
export const ConnectAccountButton: FC<ConnectAccountButtonProps> = ({
  provider,
}) => {
  const handleClick = async () => {
    await authClient.linkSocial({
      provider,
      callbackURL: "/account",
      errorCallbackURL: "/account",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md border border-border px-3 py-1.5 hover:bg-surface"
    >
      Connect {providerNames[provider]}
    </button>
  );
};
