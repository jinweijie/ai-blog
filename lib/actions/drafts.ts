"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDraft(formData: FormData): Promise<void> {
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const bulletPoints = String(formData.get("bulletPoints") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!title || !bulletPoints) {
    throw new Error("Title and bullet points are required.");
  }

  const slug = slugInput ? slugify(slugInput) : slugify(title);

  const draft = await prisma.ideaDraft.create({
    data: {
      title,
      slug,
      bulletPoints,
      notes: notes || null,
    },
  });

  revalidatePath("/admin/drafts");
  redirect(`/admin/drafts/${draft.id}`);
}

export async function updateDraft(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) {
    throw new Error("Draft id is missing.");
  }

  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const bulletPoints = String(formData.get("bulletPoints") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const generatedBody = String(formData.get("generatedBody") || "").trim();
  const providerConfigId = String(formData.get("providerConfigId") || "").trim();
  const tags = String(formData.get("tags") || "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") || "").trim();

  if (!title || !bulletPoints) {
    throw new Error("Title and bullet points are required.");
  }

  const slug = slugInput ? slugify(slugInput) : slugify(title);

  await prisma.ideaDraft.update({
    where: { id },
    data: {
      title,
      slug,
      bulletPoints,
      notes: notes || null,
      generatedBody: generatedBody || null,
      providerConfigId: providerConfigId || null,
      tags,
      coverImageUrl: coverImageUrl || null,
    },
  });

  revalidatePath(`/admin/drafts/${id}`);
  revalidatePath("/admin/drafts");
}

export async function publishDraft(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) {
    throw new Error("Draft id is missing.");
  }

  const draft = await prisma.ideaDraft.findUnique({
    where: { id },
    include: { post: true },
  });

  if (!draft) {
    throw new Error("Draft not found.");
  }

  if (!draft.generatedBody) {
    throw new Error("Generate content before publishing.");
  }

  const slug = slugify(draft.slug || draft.title);

  const existing = await prisma.post.findFirst({
    where: {
      slug,
      NOT: draft.post ? { id: draft.post.id } : undefined,
    },
  });

  if (existing) {
    throw new Error("Slug already exists on another post.");
  }

  const summary = draft.generatedBody.slice(0, 180).trim();
  const tags = (draft.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (draft.post) {
    await prisma.post.update({
      where: { id: draft.post.id },
      data: {
        title: draft.title,
        slug,
        summary,
        body: draft.generatedBody,
        coverImageUrl: draft.coverImageUrl,
        tags,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  } else {
    const post = await prisma.post.create({
      data: {
        title: draft.title,
        slug,
        summary,
        body: draft.generatedBody,
        coverImageUrl: draft.coverImageUrl,
        tags,
        status: "PUBLISHED",
        publishedAt: new Date(),
        draft: {
          connect: { id: draft.id },
        },
      },
    });
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}
