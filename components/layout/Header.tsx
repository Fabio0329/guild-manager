import Link from "next/link";
import { type FC, Suspense } from "react";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { site } from "@/lib/site";

export const Header: FC = () => {
  return (
    <header className="border-b border-border">
      <div className="page-container flex min-h-16 flex-wrap items-center justify-between gap-x-3 py-2">
        <Link
          href="/"
          className="font-semibold tracking-tight whitespace-nowrap"
        >
          {site.name}
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {/* Add <nav aria-label="Main"> here once there are page links. The
              toggle stays outside it: it's a setting, not a destination. */}
          <ThemeToggle />
          {/* The account area depends on the request's cookie. Suspense lets
              the rest of the header be prerendered as a static shell; this
              part is filled in per request. */}
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
};
