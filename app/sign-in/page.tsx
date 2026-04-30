import { signIn } from "@/lib/auth";
import FormSubmitButton from "@/components/FormSubmitButton";

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
    <div className="card mx-auto max-w-md space-y-6 p-6">
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
        <FormSubmitButton label="Sign in" pendingLabel="Signing in..." className="btn-primary w-full" />
      </form>
    </div>
  );
}
