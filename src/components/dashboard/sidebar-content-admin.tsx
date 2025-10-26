"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLayoutDashboard } from "react-icons/lu";

interface SidebarContentAdminProps {}

export function SidebarContentAdmin({}: SidebarContentAdminProps) {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className={cn(pathname === "/admin" && "bg-primary text-primary-foreground")}>
                <Link href="/admin" className="flex items-center gap-2">
                  <LuLayoutDashboard className="size-6" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className={cn(pathname === "/admin/users" && "bg-primary text-primary-foreground")}>
                <Link href="/admin/users" className="flex items-center gap-2">
                  <UsersIcon className="size-6" />
                  <span>Utilizadores</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
