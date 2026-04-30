import { signIn } from "@/lib/auth";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  async function handleSignIn(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    await signIn("credentials", {
      email,
      password,
      redirectTo: searchParams.callbackUrl || "/admin",
    });
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-lg border border-slate-200 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <p className="text-sm text-slate-600">Use your admin credentials.</p>
      </div>
      <form action={handleSignIn} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="w-full" />
        </div>
        <div className="space-y-1">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="w-full" />
        </div>
        <button className="w-full bg-slate-900 text-white" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
