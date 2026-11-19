import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountDetails } from "@/components/auth/AccountDetails";

export const metadata: Metadata = {
  title: "Account",
};

// Static shell (heading, description, fallback); the account list streams in
// per request inside <Suspense>.
export default function AccountPage(props: PageProps<"/account">) {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <p className="mt-3 text-muted">
        Ways you can sign in. Connect both to use either one.
      </p>
      <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}>
        <AccountDetails searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
