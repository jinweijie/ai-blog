import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DraftList() {
  const drafts = await prisma.ideaDraft.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Drafts</h2>
          <p className="section-subtitle">Idea drafts and generated content.</p>
        </div>
        <Link className="btn-primary" href="/admin/drafts/new">
          New draft
        </Link>
      </div>
      <div className="space-y-3">
        {drafts.length === 0 ? (
          <p className="text-sm text-slate-600">No drafts yet.</p>
        ) : (
          drafts.map((draft) => (
            <Link
              key={draft.id}
              href={`/admin/drafts/${draft.id}`}
              className="card block p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{draft.title}</div>
                  <div className="text-xs text-slate-500">{draft.slug}</div>
                </div>
                <div className="text-xs text-slate-500">
                  {draft.updatedAt.toDateString()}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
