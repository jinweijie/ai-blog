import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";
import ReaderToolbar from "@/components/ReaderToolbar";
import { getBlogSettings } from "@/lib/settings";

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const settings = await getBlogSettings();
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {settings.siteTitle}
        </p>
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="text-sm text-slate-500">
          Published {post.publishedAt?.toDateString()}
        </p>
      </header>
      <ReaderToolbar />
      {post.coverImageUrl && (
        <Image
          src={post.coverImageUrl}
          alt={post.title}
          width={1200}
          height={630}
          unoptimized
          className="w-full rounded-lg border border-slate-200"
        />
      )}
      <div
        className="reader-surface reader-content"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
      />
    </article>
  );
}
