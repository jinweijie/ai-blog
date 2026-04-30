import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Blog",
  description: "An AI-assisted blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link className="text-lg font-semibold" href="/">
                AI Blog
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link className="text-slate-700 hover:text-slate-900" href="/blog">
                  Blog
                </Link>
                <Link className="text-slate-700 hover:text-slate-900" href="/admin">
                  Admin
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
