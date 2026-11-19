// The signed-in user's linked sign-in methods (account rows).
import "server-only";

import { headers } from "next/headers";
import { auth } from "@/server/auth/config";

// Throws if nobody is signed in: call it only after getSession() found a
// user. Reads the request, so render callers inside <Suspense>.
export const listAccounts = async () => {
  return auth.api.listUserAccounts({ headers: await headers() });
};
