import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminHome() {
  const [draftCount, postCount, providerCount] = await Promise.all([
    prisma.ideaDraft.count(),
    prisma.post.count(),
    prisma.aIProviderConfig.count(),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="section-title">Workspace overview</h2>
        <p className="section-subtitle">Quick stats and actions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-sm text-slate-600">Drafts</div>
          <div className="text-2xl font-semibold">{draftCount}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-600">Posts</div>
          <div className="text-2xl font-semibold">{postCount}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-600">AI Providers</div>
          <div className="text-2xl font-semibold">{providerCount}</div>
        </div>
      </div>
      <div className="flex gap-3">
        <Link className="btn-primary" href="/admin/drafts/new">
          New draft
        </Link>
        <Link className="btn-secondary" href="/admin/providers">
          Configure providers
        </Link>
      </div>
    </section>
  );
}
