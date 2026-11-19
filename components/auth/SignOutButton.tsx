"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";
import { authClient } from "@/lib/auth/client";

// Deletes the session (the database row and the cookie), then re-renders the
// server components so the header shows the sign-in buttons again.
export const SignOutButton: FC = () => {
  const router = useRouter();

  const handleClick = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md border border-border px-3 py-1.5 hover:bg-surface"
    >
      Sign out
    </button>
  );
};
