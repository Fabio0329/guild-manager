import type { Metadata } from "next";
import { geistMono, geistSans } from "@/lib/fonts";
import { site } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The theme script sets data-theme on <html> before React hydrates, so
      // the server HTML and the browser's differ there on purpose.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <main className="page-container flex-1 py-16">{children}</main>
      </body>
    </html>
  );
}
