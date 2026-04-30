import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Published {post.publishedAt?.toDateString()}
        </p>
      </header>
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
      <div className="whitespace-pre-wrap text-slate-800">
        {post.body}
      </div>
    </article>
  );
}
