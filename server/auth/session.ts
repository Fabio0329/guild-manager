// "Who's signed in?" for server components and server code: the single place
// that verifies sessions (Next's docs call this a Data Access Layer). Every
// protected page and action checks here, on the server; proxy.ts is only an
// early redirect.
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { signInPath } from "@/lib/auth/redirect";
import { auth } from "@/server/auth/config";

// Reads the session cookie from the current request and looks it up in the
// database. Returns { user, session }, or null when signed out. cache() makes
// repeat calls within one request (header, page) share a single lookup.
// Reading the request makes the caller dynamic: with cacheComponents on,
// render it inside <Suspense>.
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

// For protected pages: the session, or a redirect to sign in that comes back
// to `returnTo` afterwards. Checks the database, so an expired, deleted, or
// forged cookie that got past proxy.ts is still turned away here.
export const requireSession = async (returnTo: string) => {
  const session = await getSession();
  if (!session) {
    redirect(signInPath(returnTo));
  }
  return session;
};
