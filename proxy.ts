// Runs before protected pages render. An optimistic check only: it sees
// whether a session cookie EXISTS, without asking the database, so it's fast
// enough for every request (including prefetches). A forged or expired
// cookie passes here; the real check is requireSession() on the server.
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { signInPath } from "@/lib/auth/redirect";

export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) {
    return NextResponse.next();
  }
  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(
    new URL(signInPath(pathname + search), request.url),
  );
}

// Pages that need a signed-in user. Add each new protected section here.
export const config = {
  matcher: ["/account/:path*"],
};
