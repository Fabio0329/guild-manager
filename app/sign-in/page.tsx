import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInOptions } from "@/components/auth/SignInOptions";

export const metadata: Metadata = {
  title: "Sign in",
};

// Where protected pages send signed-out visitors (?callbackURL=… remembers
// the page). Static shell; the buttons depend on the URL and the session.
export default function SignInPage(props: PageProps<"/sign-in">) {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-3 text-muted">
        Use Battle.net or Discord. If you&apos;ve connected both, either one
        works.
      </p>
      <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}>
        <SignInOptions searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
