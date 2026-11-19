// "Who's signed in?" for server components and server code.
import "server-only";

import { headers } from "next/headers";
import { auth } from "@/server/auth/config";

// Reads the session cookie from the current request and looks it up in the
// database. Returns { user, session }, or null when signed out. Reading the
// request makes the caller dynamic: with cacheComponents on, render it
// inside <Suspense>.
export const getSession = async () => {
  return auth.api.getSession({ headers: await headers() });
};
