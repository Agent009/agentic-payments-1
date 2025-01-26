import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInForm } from "@/components/forms/sign-in-form";

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Sign in to your account</h2>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
