"use client";

import { useFormStatus } from "react-dom";
import { useRef, useState } from "react";

type ProviderOption = {
  id: string;
  name: string;
  provider: string;
  model: string;
};

type DraftData = {
  id: string;
  title: string;
  slug: string;
  bulletPoints: string;
  notes: string | null;
  generatedBody: string | null;
  providerConfigId: string | null;
  tags: string;
  coverImageUrl: string | null;
};

type DraftEditorProps = {
  draft: DraftData;
  providers: ProviderOption[];
  updateDraft: (formData: FormData) => Promise<void>;
  publishDraft: (formData: FormData) => Promise<void>;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="bg-slate-900 text-white" type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </button>
  );
}

export default function DraftEditor({
  draft,
  providers,
  updateDraft,
  publishDraft,
}: DraftEditorProps) {
  const [generatedBody, setGeneratedBody] = useState(draft.generatedBody || "");
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  async function handleGenerate() {
    if (!formRef.current) return;
    setGenerationStatus("Generating...");

    const formData = new FormData(formRef.current);
    const payload = {
      title: String(formData.get("title") || ""),
      bulletPoints: String(formData.get("bulletPoints") || ""),
      notes: String(formData.get("notes") || ""),
      providerConfigId: String(formData.get("providerConfigId") || ""),
    };

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setGenerationStatus(data.error || "Generation failed");
      return;
    }

    const data = await res.json();
    setGeneratedBody(data.content || "");
    setGenerationStatus("Generation complete");
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} action={updateDraft} className="space-y-4">
        <input type="hidden" name="id" value={draft.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" defaultValue={draft.title} className="w-full" />
          </div>
          <div className="space-y-1">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" defaultValue={draft.slug} className="w-full" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input id="tags" name="tags" defaultValue={draft.tags} className="w-full" />
          </div>
          <div className="space-y-1">
            <label htmlFor="coverImageUrl">Cover image URL</label>
            <input
              id="coverImageUrl"
              name="coverImageUrl"
              defaultValue={draft.coverImageUrl || ""}
              className="w-full"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="bulletPoints">Bullet points</label>
          <textarea
            id="bulletPoints"
            name="bulletPoints"
            defaultValue={draft.bulletPoints}
            rows={6}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={draft.notes || ""}
            rows={4}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="providerConfigId">Provider</label>
          <select
            id="providerConfigId"
            name="providerConfigId"
            defaultValue={draft.providerConfigId || ""}
            className="w-full"
          >
            <option value="">Select provider</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name} ({provider.provider} · {provider.model})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="generatedBody">Generated body</label>
          <textarea
            id="generatedBody"
            name="generatedBody"
            value={generatedBody}
            onChange={(event) => setGeneratedBody(event.target.value)}
            rows={12}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton label="Save draft" />
          <button
            className="border border-slate-300"
            type="button"
            onClick={handleGenerate}
          >
            Generate
          </button>
          {generationStatus && (
            <span className="text-sm text-slate-600">{generationStatus}</span>
          )}
        </div>
      </form>
      <form action={publishDraft} className="space-y-2">
        <input type="hidden" name="id" value={draft.id} />
        <button className="bg-emerald-600 text-white" type="submit">
          Publish to blog
        </button>
      </form>
    </div>
  );
}
