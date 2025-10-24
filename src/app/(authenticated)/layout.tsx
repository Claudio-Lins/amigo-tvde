import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();
  const user = session?.user;

  // Se não há usuário autenticado, redirecionar para login
  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
