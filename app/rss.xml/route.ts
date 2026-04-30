import { prisma } from "@/lib/prisma";
import { getBlogSettings } from "@/lib/settings";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const settings = await getBlogSettings();
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const siteUrl = process.env.AUTH_URL || "";
  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${escapeXml(url)}</link>
        <guid>${escapeXml(url)}</guid>
        <pubDate>${post.publishedAt?.toUTCString() || post.updatedAt.toUTCString()}</pubDate>
        <description>${escapeXml(post.summary || "")}</description>
      </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(settings.siteTitle)}</title>
      <link>${escapeXml(siteUrl)}</link>
      <description>${escapeXml(settings.siteSubtitle)}</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
