import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function DriverLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();
  const user = session?.user;

  // Se não há usuário autenticado, redirecionar para login
  if (!user) {
    redirect("/sign-in");
  }

  // Se o usuário não é DRIVER, redirecionar para página não autorizada
  if (user.role !== "DRIVER") {
    redirect("/unauthorized");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col p-4 w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
