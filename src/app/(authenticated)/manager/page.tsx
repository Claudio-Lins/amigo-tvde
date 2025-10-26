import { getServerSession } from "@/lib/get-session";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Área do Gestor",
};

export default async function ManagerPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role !== "MANAGER") {
    redirect("/unauthorized");
  }

  return (
    <main className={cn("flex flex-col gap-4")}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Área do Gestor</h1>
          <p className="text-muted-foreground">Bem-vindo, {user.fullName}! Esta é sua área de gestão.</p>
        </div>
      </div>
    </main>
  );
}
