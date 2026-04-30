export default function Home() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">AI Blog</h1>
      <p className="text-slate-700">
        Build and publish AI-assisted content with a secure admin workspace.
      </p>
      <div className="flex gap-4">
        <a className="bg-slate-900 text-white" href="/blog">
          Read the blog
        </a>
        <a className="border border-slate-300" href="/admin">
          Go to admin
        </a>
      </div>
    </section>
  );
}
