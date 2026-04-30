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
    redirect("/admin/sign-in");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-slate-600">Welcome, {session.user.email}</p>
        </div>
        <form action={handleSignOut}>
          <button className="border border-slate-300" type="submit">
            Sign out
          </button>
        </form>
      </header>
      <nav className="flex flex-wrap gap-3 text-sm">
        <Link className="border border-slate-200 px-3 py-2" href="/admin">
          Overview
        </Link>
        <Link className="border border-slate-200 px-3 py-2" href="/admin/drafts">
          Drafts
        </Link>
        <Link className="border border-slate-200 px-3 py-2" href="/admin/posts">
          Posts
        </Link>
        <Link className="border border-slate-200 px-3 py-2" href="/admin/providers">
          AI Providers
        </Link>
      </nav>
      {children}
    </div>
  );
}
