import { getServerSession } from "@/lib/get-session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResendVerificationButton } from "./resend-verification-button";

export const metadata: Metadata = {
  title: "Verificar Email",
};

export default async function VerifyEmailPage() {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) {
    redirect("/sign-in");
  }
  if (user.emailVerified) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Verificar seu email</h1>
          <p className="text-muted-foreground">Um email de verificação foi enviado para sua caixa de entrada.</p>
        </div>
        <ResendVerificationButton email={user.email} />
      </div>
    </main>
  );
}
