import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();
  const user = session?.user;

  // Se não há usuário autenticado, redirecionar para login
  if (!user) {
    redirect("/sign-in");
  }

  // Se o usuário é ADMIN, redirecionar para área de admin
  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  return <>{children}</>;
}
