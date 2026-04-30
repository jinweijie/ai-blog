import Link from "next/link";

export default function SiteChrome({
  title,
}: {
  title: string;
}) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="text-lg font-semibold" href="/">
          {title}
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
  );
}
