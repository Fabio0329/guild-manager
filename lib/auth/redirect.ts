// Where to send a signed-out visitor, and where to send them back afterwards.
// Shared by proxy.ts, the server-side session check, and the sign-in page.

// The sign-in page, remembering the page to return to.
export const signInPath = (returnTo: string) => {
  return `/sign-in?callbackURL=${encodeURIComponent(returnTo)}`;
};

// The return address comes from the URL, so anyone can put anything there.
// Accept only a path on this site ("/account"); anything else becomes "/".
// "//evil.example" and "/\evil.example" look like paths but browsers treat
// them as other sites, so they're refused too. Without this check, a link
// could sign someone in and then forward them to a look-alike site: an
// "open redirect".
export const safeCallbackPath = (value: unknown) => {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return "/";
  }
  return value;
};
