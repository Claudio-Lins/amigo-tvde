import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();
  const user = session?.user;

  // Se não há usuário autenticado, redirecionar para login
  if (!user) {
    redirect("/sign-in");
  }

  // Se o usuário não é ADMIN, redirecionar para página não autorizada
  if (user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
