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
import { LayoutDashboardIcon, UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarContentClientProps {
  isAdmin: boolean;
}

export function SidebarContentClient({ isAdmin }: SidebarContentClientProps) {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className={cn(pathname === "/dashboard" && "bg-primary text-primary-foreground")}>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboardIcon className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                className={cn(pathname === "/dashboard/profile" && "bg-primary text-primary-foreground")}
              >
                <Link href="/dashboard/profile" className="flex items-center gap-2">
                  <UserIcon className="size-4" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(pathname === "/dashboard/users" && "bg-primary text-primary-foreground")}
                >
                  <Link href="/dashboard/users" className="flex items-center gap-2">
                    <UsersIcon className="size-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
