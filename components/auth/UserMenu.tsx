import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { SignInButton } from "@/components/auth/SignInButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getSession } from "@/server/auth/session";

// The header's account area: who's signed in (linking to /account) and a
// sign-out button, or the sign-in buttons. Reads the request's cookie, so the header renders it
// inside <Suspense>.
export const UserMenu: FC = async () => {
  const session = await getSession();

  if (!session) {
    return (
      <>
        <SignInButton provider="battlenet" />
        <SignInButton provider="discord" />
      </>
    );
  }

  const { name, image } = session.user;

  return (
    <>
      <Link href="/account" className="flex items-center gap-2 hover:underline">
        {image ? (
          // Decorative: the name next to it says who this is.
          <Image
            src={image}
            alt=""
            width={24}
            height={24}
            className="size-6 rounded-full"
          />
        ) : null}
        <span className="font-medium">{name}</span>
      </Link>
      <SignOutButton />
    </>
  );
};
