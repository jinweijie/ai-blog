import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="admin-shell">
      <aside className="card h-fit p-4">
        <div className="mb-4">
          <div className="text-sm text-slate-500">Admin</div>
          <div className="font-semibold">{session.user.email}</div>
        </div>
        <nav className="admin-nav">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/drafts">Drafts</Link>
          <Link href="/admin/posts">Posts</Link>
          <Link href="/admin/providers">AI Providers</Link>
        </nav>
        <form action={handleSignOut} className="mt-6">
          <button className="btn-secondary w-full" type="submit">
            Sign out
          </button>
        </form>
      </aside>
      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Workspace</h1>
            <p className="text-sm text-slate-600">Manage posts and AI drafts.</p>
          </div>
        </header>
        {children}
      </section>
    </div>
  );
}
