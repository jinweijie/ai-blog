import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import FormSubmitButton from "@/components/FormSubmitButton";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const errorMessage =
    searchParams.error === "CredentialsSignin"
      ? "Invalid email or password."
      : searchParams.error
        ? "Sign in failed. Please try again."
        : null;

  async function handleSignIn(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: searchParams.callbackUrl || "/admin",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        const params = new URLSearchParams();
        params.set("error", error.type ?? "CredentialsSignin");
        if (searchParams.callbackUrl) {
          params.set("callbackUrl", searchParams.callbackUrl);
        }
        redirect(`/sign-in?${params.toString()}`);
      }
      throw error;
    }
  }

  return (
    <div className="card mx-auto max-w-md space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <p className="text-sm text-slate-600">Use your admin credentials.</p>
      </div>
      <form action={handleSignIn} className="space-y-4">
        {errorMessage ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}
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
