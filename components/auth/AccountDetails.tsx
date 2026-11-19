import type { FC } from "react";
import { ConnectedAccounts } from "@/components/auth/ConnectedAccounts";

type AccountDetailsProps = {
  searchParams: PageProps<"/account">["searchParams"];
};

// The request-dependent part of /account: reads ?error=… and (through
// ConnectedAccounts) the session. searchParams is a Promise: the page passes
// it down unopened and only this component, inside <Suspense>, awaits it, so
// the rest of the page stays a static shell.
export const AccountDetails: FC<AccountDetailsProps> = async ({
  searchParams,
}) => {
  const { error } = await searchParams;
  // ?error=a&error=b arrives as an array; only a single value is used.
  return (
    <ConnectedAccounts error={typeof error === "string" ? error : undefined} />
  );
};
