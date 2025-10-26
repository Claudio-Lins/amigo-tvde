import { RoleDemo } from "@/components/role-demo";
import { getServerSession } from "@/lib/get-session";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Área do Motorista",
};

export default async function DriverPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className={cn("mx-auto w-full max-w-6xl px-4 py-12")}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Área do Motorista</h1>
          <p className="text-muted-foreground">Bem-vindo, {user.fullName}! Esta é sua área pessoal.</p>
        </div>
        <RoleDemo />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Perfil</h3>
            <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Configurações</h3>
            <p className="text-sm text-muted-foreground">Ajuste suas preferências</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Histórico</h3>
            <p className="text-sm text-muted-foreground">Veja suas atividades recentes</p>
          </div>
        </div>
      </div>
    </main>
  );
}
