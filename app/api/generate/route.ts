import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptSecret } from "@/lib/crypto";

function buildPrompt({
  title,
  bulletPoints,
  notes,
}: {
  title: string;
  bulletPoints: string;
  notes?: string;
}) {
  return `Write a clear, well-structured blog post titled "${title}".\n\nBullet points:\n${bulletPoints}\n\nNotes:\n${notes || "(none)"}\n\nRequirements:\n- Use markdown headings\n- Keep a friendly, professional tone\n- Include a short summary at the top`;
}

async function generateWithOpenAI({
  apiKey,
  model,
  prompt,
}: {
  apiKey: string;
  model: string;
  prompt: string;
}) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error("OpenAI request failed");
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function generateWithAzureOpenAI({
  apiKey,
  endpoint,
  deployment,
  apiVersion,
  prompt,
}: {
  apiKey: string;
  endpoint: string;
  deployment: string;
  apiVersion: string;
  prompt: string;
}) {
  const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error("Azure OpenAI request failed");
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function generateWithAnthropic({
  apiKey,
  model,
  prompt,
}: {
  apiKey: string;
  model: string;
  prompt: string;
}) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error("Anthropic request failed");
  }

  const data = await res.json();
  return data.content?.[0]?.text || "";
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const title = String(body.title || "").trim();
  const bulletPoints = String(body.bulletPoints || "").trim();
  const notes = String(body.notes || "").trim();
  const providerConfigId = String(body.providerConfigId || "").trim();

  if (!title || !bulletPoints || !providerConfigId) {
    return NextResponse.json(
      { error: "Title, bullet points, and provider are required." },
      { status: 400 }
    );
  }

  const provider = await prisma.aIProviderConfig.findUnique({
    where: { id: providerConfigId },
  });

  if (!provider) {
    return NextResponse.json({ error: "Provider not found." }, { status: 404 });
  }

  const apiKey = decryptSecret(provider.apiKeyEnc);
  const prompt = buildPrompt({ title, bulletPoints, notes });

  try {
    let content = "";

    if (provider.provider === "OPENAI") {
      content = await generateWithOpenAI({ apiKey, model: provider.model, prompt });
    } else if (provider.provider === "AZURE_OPENAI") {
      if (!provider.azureEndpoint || !provider.azureDeployment || !provider.azureApiVersion) {
        return NextResponse.json(
          { error: "Azure settings are incomplete." },
          { status: 400 }
        );
      }
      content = await generateWithAzureOpenAI({
        apiKey,
        endpoint: provider.azureEndpoint,
        deployment: provider.azureDeployment,
        apiVersion: provider.azureApiVersion,
        prompt,
      });
    } else if (provider.provider === "ANTHROPIC") {
      content = await generateWithAnthropic({ apiKey, model: provider.model, prompt });
    }

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
