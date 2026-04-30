"use server";

import { prisma } from "@/lib/prisma";
import { encryptSecret } from "@/lib/crypto";
import { revalidatePath } from "next/cache";

export async function createProvider(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  const provider = String(formData.get("provider") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const apiKey = String(formData.get("apiKey") || "").trim();
  const azureEndpoint = String(formData.get("azureEndpoint") || "").trim();
  const azureDeployment = String(formData.get("azureDeployment") || "").trim();
  const azureApiVersion = String(formData.get("azureApiVersion") || "").trim();

  if (!name || !provider || !model || !apiKey) {
    throw new Error("Name, provider, model, and API key are required.");
  }

  await prisma.aIProviderConfig.create({
    data: {
      name,
      provider: provider as "OPENAI" | "AZURE_OPENAI" | "ANTHROPIC",
      model,
      apiKeyEnc: encryptSecret(apiKey),
      azureEndpoint: azureEndpoint || null,
      azureDeployment: azureDeployment || null,
      azureApiVersion: azureApiVersion || null,
    },
  });

  revalidatePath("/admin/providers");
}
