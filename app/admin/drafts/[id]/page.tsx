import { notFound } from "next/navigation";
import DraftEditor from "@/components/DraftEditor";
import { prisma } from "@/lib/prisma";
import { updateDraft, publishDraft } from "@/lib/actions/drafts";

export default async function DraftDetail({
  params,
}: {
  params: { id: string };
}) {
  const draft = await prisma.ideaDraft.findUnique({
    where: { id: params.id },
  });

  if (!draft) {
    notFound();
  }

  const providers = await prisma.aIProviderConfig.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Draft</h2>
        <p className="text-sm text-slate-600">Edit and generate content.</p>
      </div>
      <DraftEditor
        draft={{
          id: draft.id,
          title: draft.title,
          slug: draft.slug,
          bulletPoints: draft.bulletPoints,
          notes: draft.notes,
          generatedBody: draft.generatedBody,
          providerConfigId: draft.providerConfigId,
          tags: draft.tags,
          coverImageUrl: draft.coverImageUrl,
        }}
        providers={providers.map((provider) => ({
          id: provider.id,
          name: provider.name,
          provider: provider.provider,
          model: provider.model,
        }))}
        updateDraft={updateDraft}
        publishDraft={publishDraft}
      />
    </section>
  );
}
