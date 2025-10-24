import { MagicLinkLoginForm } from "@/components/magic-link-login-form";
import type { Metadata } from "next";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <main className="flex flex-col gap-4 min-h-svh items-center justify-center px-4">
      <SignInForm />
      <MagicLinkLoginForm />
    </main>
  );
}
