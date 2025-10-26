import { SingOut } from "@/components/auth/sing-out";
import { RoleDemo } from "@/components/role-demo";

import { getServerSession } from "@/lib/get-session";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Administração",
};

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <main className={cn("flex flex-col gap-4")}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Administração</h1>
          <p className="text-muted-foreground">Bem-vindo, {user.name}! Você tem acesso de administrador.</p>
        </div>
        <RoleDemo />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            {/* logout */}
            <SingOut />
          </div>
        </div>
      </div>
    </main>
  );
}
