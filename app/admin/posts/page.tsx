import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PostList() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div>
        <h2 className="section-title">Posts</h2>
        <p className="section-subtitle">Published and draft posts.</p>
      </div>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-sm text-slate-600">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{post.title}</div>
                  <div className="text-xs text-slate-500">{post.slug}</div>
                </div>
                <span className="rounded-full border border-slate-200 px-2 py-1 text-xs">
                  {post.status}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Updated {post.updatedAt.toDateString()}
              </div>
              {post.status === "PUBLISHED" && (
                <Link className="mt-2 inline-block text-sm text-slate-700" href={`/blog/${post.slug}`}>
                  View post
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
