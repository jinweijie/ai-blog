"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBlogSettings(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const siteTitle = String(formData.get("siteTitle") || "").trim();
  const siteSubtitle = String(formData.get("siteSubtitle") || "").trim();
  const accent = String(formData.get("accent") || "slate").trim();
  const fontPair = String(formData.get("fontPair") || "serif").trim();

  if (!id) {
    throw new Error("Settings id missing");
  }

  await prisma.blogSettings.update({
    where: { id },
    data: {
      siteTitle: siteTitle || "AI Blog",
      siteSubtitle: siteSubtitle || "AI-assisted publishing",
      accent,
      fontPair,
    },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/settings");
}
