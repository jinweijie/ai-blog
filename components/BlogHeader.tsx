import Link from "next/link";

export default function BlogHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Journal</p>
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="text-slate-600">{subtitle}</p>
      <div className="flex gap-3">
        <Link className="btn-primary" href="/blog">
          Read latest
        </Link>
        <Link className="btn-secondary" href="/rss.xml">
          RSS feed
        </Link>
      </div>
    </div>
  );
}
