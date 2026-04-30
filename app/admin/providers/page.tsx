import { prisma } from "@/lib/prisma";
import { createProvider } from "@/lib/actions/providers";

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

      <form action={createProvider} className="card space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" className="w-full" />
          </div>
          <div className="space-y-1">
            <label htmlFor="provider">Provider</label>
            <select id="provider" name="provider" className="w-full">
              <option value="OPENAI">OpenAI</option>
              <option value="AZURE_OPENAI">Azure OpenAI</option>
              <option value="ANTHROPIC">Claude</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="model">Model</label>
            <input id="model" name="model" className="w-full" placeholder="gpt-4o-mini" />
          </div>
          <div className="space-y-1">
            <label htmlFor="apiKey">API key</label>
            <input id="apiKey" name="apiKey" type="password" className="w-full" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="azureEndpoint">Azure endpoint</label>
            <input id="azureEndpoint" name="azureEndpoint" className="w-full" />
          </div>
          <div className="space-y-1">
            <label htmlFor="azureDeployment">Azure deployment</label>
            <input id="azureDeployment" name="azureDeployment" className="w-full" />
          </div>
          <div className="space-y-1">
            <label htmlFor="azureApiVersion">Azure API version</label>
            <input id="azureApiVersion" name="azureApiVersion" className="w-full" />
          </div>
        </div>
        <button className="btn-primary" type="submit">
          Save provider
        </button>
      </form>

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
