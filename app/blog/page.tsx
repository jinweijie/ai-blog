import BlogIndex from "@/components/BlogIndex";

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: { tag?: string; month?: string };
}) {
  return <BlogIndex searchParams={searchParams} />;
}
