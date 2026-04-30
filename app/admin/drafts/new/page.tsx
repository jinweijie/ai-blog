import { createDraft } from "@/lib/actions/drafts";

export default function NewDraftPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="section-title">New draft</h2>
        <p className="section-subtitle">Start from bullet points.</p>
      </div>
      <form action={createDraft} className="card space-y-4 p-6">
        <div className="space-y-1">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" className="w-full" required />
        </div>
        <div className="space-y-1">
          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" className="w-full" placeholder="auto-from-title" />
        </div>
        <div className="space-y-1">
          <label htmlFor="bulletPoints">Bullet points</label>
          <textarea
            id="bulletPoints"
            name="bulletPoints"
            rows={6}
            className="w-full"
            placeholder="- Point one\n- Point two"
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={4} className="w-full" />
        </div>
        <button className="btn-primary" type="submit">
          Create draft
        </button>
      </form>
    </section>
  );
}
