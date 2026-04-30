import { prisma } from "@/lib/prisma";
import { createProvider } from "@/lib/actions/providers";
import ProviderForm from "@/components/ProviderForm";

export default async function ProviderPage() {
  const providers = await prisma.aIProviderConfig.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div>
        <h2 className="section-title">AI providers</h2>
        <p className="section-subtitle">Configure API access.</p>
      </div>

      <ProviderForm action={createProvider} />

      <div className="space-y-3">
        {providers.length === 0 ? (
          <p className="text-sm text-slate-600">No providers configured.</p>
        ) : (
          providers.map((provider) => (
            <div key={provider.id} className="card p-4">
              <div className="font-medium">{provider.name}</div>
              <div className="text-xs text-slate-500">
                {provider.provider} · {provider.model}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
