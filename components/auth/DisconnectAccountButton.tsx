"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";
import { authClient } from "@/lib/auth/client";
import { type ProviderId, providerNames } from "@/lib/auth/providers";

type DisconnectAccountButtonProps = {
  provider: ProviderId;
  // The account row's ID (not the provider's user ID).
  accountId: string;
};

// Removes one sign-in method. The server refuses to remove the last one, so
// nobody can lock themselves out; the page doesn't offer it either.
export const DisconnectAccountButton: FC<DisconnectAccountButtonProps> = ({
  provider,
  accountId,
}) => {
  const router = useRouter();

  const handleClick = async () => {
    await authClient.unlinkAccount({ accountId });
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md border border-border px-3 py-1.5 hover:bg-surface"
    >
      Disconnect {providerNames[provider]}
    </button>
  );
};
