import { ModeToggle } from "@/components/mode-toggle";
import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-dropdown";
import { getServerSession } from "@/lib/get-session";
import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";
import { SidebarContentAdmin } from "./sidebar-content-admin";
import { SidebarContentDriver } from "./sidebar-content-driver";
import { SidebarContentManager } from "./sidebar-content-manager";

// Sample sidebar component
export async function AppSidebar() {
  const session = await getServerSession();
  const user = session?.user;

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER";
  const isDriver = user?.role === "DRIVER";

  if (!user) return null;

  return (
    <Sidebar>
      <SidebarHeader className="bg-background border-b flex flex-row items-center justify-start">
        {/* <SidebarTrigger /> */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <LuLayoutDashboard className="size-8" />
          {isAdmin ? "Admin" : isManager ? "Manager" : isDriver ? "Driver" : ""}
        </Link>
      </SidebarHeader>
      {isAdmin && <SidebarContentAdmin />}
      {isManager && <SidebarContentManager />}
      {isDriver && <SidebarContentDriver />}
      <SidebarFooter>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserDropdown user={user} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
