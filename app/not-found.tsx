import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section>
      <p className="text-sm font-medium text-muted">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-3 text-muted">
        It may have moved, or the link has a typo.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block font-medium text-accent underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </section>
  );
}
