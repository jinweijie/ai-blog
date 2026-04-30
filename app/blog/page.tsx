import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getBlogSettings } from "@/lib/settings";

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: { tag?: string; month?: string };
}) {
  const settings = await getBlogSettings();
  const tag = searchParams.tag;
  const month = searchParams.month;

  const where: {
    status: "PUBLISHED";
    tags?: { has: string };
    publishedAt?: { gte: Date; lt: Date };
  } = { status: "PUBLISHED" };

  if (tag) {
    where.tags = { has: tag };
  }

  if (month) {
    const [year, m] = month.split("-");
    const start = new Date(Number(year), Number(m) - 1, 1);
    const end = new Date(Number(year), Number(m), 1);
    where.publishedAt = { gte: start, lt: end };
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  const allPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  const tagMap = new Map<string, number>();
  const monthMap = new Map<string, number>();

  for (const post of allPosts) {
    for (const t of post.tags) {
      tagMap.set(t, (tagMap.get(t) || 0) + 1);
    }
    if (post.publishedAt) {
      const key = `${post.publishedAt.getFullYear()}-${String(
        post.publishedAt.getMonth() + 1
      ).padStart(2, "0")}`;
      monthMap.set(key, (monthMap.get(key) || 0) + 1);
    }
  }

  const tags = Array.from(tagMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const months = Array.from(monthMap.entries()).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">{settings.siteTitle}</h1>
          <p className="text-slate-600">{settings.siteSubtitle}</p>
        </div>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-slate-600">No published posts yet.</p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="card p-5">
                <h2 className="text-xl font-semibold">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                {post.summary && <p className="mt-2 text-slate-600">{post.summary}</p>}
                <div className="mt-3 text-xs text-slate-500">
                  {post.publishedAt
                    ? post.publishedAt.toDateString()
                    : post.updatedAt.toDateString()}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
      <aside className="space-y-6">
        <div className="card space-y-3 p-4">
          <div className="text-sm font-semibold">Filter by tag</div>
          <div className="flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <span className="text-xs text-slate-500">No tags yet</span>
            ) : (
              tags.map(([t, count]) => (
                <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="btn-ghost">
                  {t} ({count})
                </Link>
              ))
            )}
          </div>
        </div>
        <div className="card space-y-3 p-4">
          <div className="text-sm font-semibold">Archive</div>
          <div className="flex flex-col gap-2">
            {months.length === 0 ? (
              <span className="text-xs text-slate-500">No archives yet</span>
            ) : (
              months.map(([m, count]) => (
                <Link key={m} href={`/blog?month=${m}`} className="text-sm text-slate-700">
                  {m} ({count})
                </Link>
              ))
            )}
          </div>
        </div>
      </aside>
    </section>
  );
}
