import Link from "next/link";
import { getBlogSettings } from "@/lib/settings";

export default async function Home() {
  const settings = await getBlogSettings();

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          AI-assisted publishing
        </p>
        <h1 className="text-4xl font-semibold">{settings.siteTitle}</h1>
        <p className="text-slate-700">{settings.siteSubtitle}</p>
      </div>
      <div className="flex gap-3">
        <Link className="btn-primary" href="/blog">
          Read the blog
        </Link>
        <Link className="btn-secondary" href="/admin">
          Go to admin
        </Link>
      </div>
    </section>
  );
}
