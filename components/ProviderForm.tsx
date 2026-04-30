"use client";

import { useState } from "react";
import FormSubmitButton from "@/components/FormSubmitButton";

export default function ProviderForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [provider, setProvider] = useState("OPENAI");

  return (
    <form action={action} className="card space-y-4 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" className="w-full" />
        </div>
        <div className="space-y-1">
          <label htmlFor="provider">Provider</label>
          <select
            id="provider"
            name="provider"
            className="w-full"
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
          >
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
      {provider === "AZURE_OPENAI" && (
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
      )}
      <FormSubmitButton label="Save provider" pendingLabel="Saving..." />
    </form>
  );
}
