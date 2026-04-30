import "./globals.css";
import type { Metadata } from "next";

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
          <header className="border-b border-slate-200">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <a className="text-lg font-semibold" href="/">
                AI Blog
              </a>
              <nav className="flex items-center gap-4 text-sm">
                <a className="text-slate-700 hover:text-slate-900" href="/blog">
                  Blog
                </a>
                <a className="text-slate-700 hover:text-slate-900" href="/admin">
                  Admin
                </a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
