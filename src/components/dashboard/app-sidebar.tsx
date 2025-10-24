import codingInFlowLogo from "@/assets/coding_in_flow_logo.jpg";
import { ModeToggle } from "@/components/mode-toggle";
import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-dropdown";
import { getServerSession } from "@/lib/get-session";
import Image from "next/image";
import Link from "next/link";
import { SidebarContentClient } from "./sidebar-content";

// Sample sidebar component
export async function AppSidebar() {
  const session = await getServerSession();
  const user = session?.user;

  const isAdmin = user?.role === "ADMIN";

  if (!user) return null;

  return (
    <Sidebar>
      <SidebarHeader className="bg-background border-b flex flex-row items-center justify-start">
        {/* <SidebarTrigger /> */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src={codingInFlowLogo || ""}
            alt="Coding in Flow logo"
            width={32}
            height={32}
            className="border-muted rounded-full border"
          />
          Better-Authenticate
        </Link>
      </SidebarHeader>
      <SidebarContentClient isAdmin={isAdmin} />
      <SidebarFooter>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserDropdown user={user} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
