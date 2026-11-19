import type { FC } from "react";
import { ConnectAccountButton } from "@/components/auth/ConnectAccountButton";
import { DisconnectAccountButton } from "@/components/auth/DisconnectAccountButton";
import { isProviderId, providerIds, providerNames } from "@/lib/auth/providers";
import { listAccounts } from "@/server/auth/accounts";
import { requireSession } from "@/server/auth/session";

// Messages for the error codes Better Auth sends back (/account?error=…)
// when connecting fails.
const linkErrors: Record<string, string> = {
  account_already_linked_to_different_user:
    "That account already belongs to a different Guild Manager user, so it can't be connected here too.",
};

type ConnectedAccountsProps = {
  error?: string;
};

// Each provider, with Connect or Disconnect. Signed-out visitors are sent to
// sign in (and back here afterwards). Reads the session, so the page renders
// it inside <Suspense>.
export const ConnectedAccounts: FC<ConnectedAccountsProps> = async ({
  error,
}) => {
  await requireSession("/account");

  const accounts = (await listAccounts()).filter((account) => {
    return isProviderId(account.providerId);
  });
  const isLastAccount = accounts.length === 1;

  return (
    <>
      {error ? (
        <p role="alert" className="mt-6 rounded-md border border-border p-3">
          {linkErrors[error] ?? `Couldn't connect that account (${error}).`}
        </p>
      ) : null}
      <ul className="mt-6 divide-y divide-border rounded-md border border-border">
        {providerIds.map((provider) => {
          const account = accounts.find((linked) => {
            return linked.providerId === provider;
          });
          return (
            <li
              key={provider}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <span>
                <span className="font-medium">{providerNames[provider]}</span>
                <span className="ml-2 text-muted">
                  {account ? "Connected" : "Not connected"}
                </span>
              </span>
              {account && isLastAccount ? (
                <span className="text-sm text-muted">
                  Your only way to sign in
                </span>
              ) : null}
              {account && !isLastAccount ? (
                <DisconnectAccountButton
                  provider={provider}
                  accountId={account.id}
                />
              ) : null}
              {account ? null : <ConnectAccountButton provider={provider} />}
            </li>
          );
        })}
      </ul>
    </>
  );
};
