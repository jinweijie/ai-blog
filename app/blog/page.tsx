import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogIndex() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="text-slate-600">Latest published posts.</p>
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
              {post.summary && (
                <p className="mt-2 text-slate-600">{post.summary}</p>
              )}
              <div className="mt-3 text-xs text-slate-500">
                {post.publishedAt
                  ? post.publishedAt.toDateString()
                  : post.updatedAt.toDateString()}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
