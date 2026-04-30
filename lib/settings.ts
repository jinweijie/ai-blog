import { prisma } from "@/lib/prisma";

export async function getBlogSettings() {
  const existing = await prisma.blogSettings.findFirst();
  if (existing) return existing;
  return prisma.blogSettings.create({ data: {} });
}
