import { redirect } from "next/navigation";
import type { FC } from "react";
import { SignInButton } from "@/components/auth/SignInButton";
import { providerIds } from "@/lib/auth/providers";
import { safeCallbackPath } from "@/lib/auth/redirect";
import { getSession } from "@/server/auth/session";

type SignInOptionsProps = {
  searchParams: PageProps<"/sign-in">["searchParams"];
};

// The request-dependent part of /sign-in: reads ?callbackURL=… and the
// session, so the page renders it inside <Suspense>.
export const SignInOptions: FC<SignInOptionsProps> = async ({
  searchParams,
}) => {
  const { callbackURL } = await searchParams;
  // Anyone can edit the URL: only a path on this site is accepted.
  const returnTo = safeCallbackPath(callbackURL);

  // Already signed in: nothing to do here, go where they were headed.
  if (await getSession()) {
    redirect(returnTo);
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {providerIds.map((provider) => {
        return (
          <SignInButton
            key={provider}
            provider={provider}
            callbackURL={returnTo}
          />
        );
      })}
    </div>
  );
};
