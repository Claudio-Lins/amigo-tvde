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
import { CarIcon, LayoutDashboardIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCar } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";

export function SidebarContentManager() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className={cn(pathname === "/manager" && "bg-primary text-primary-foreground")}>
                <Link href="/manager" className="flex items-center gap-2">
                  <LuLayoutDashboard className="size-6" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className={cn(pathname === "/manager/cars" && "bg-primary text-primary-foreground")}>
                <Link href="/manager/cars" className="flex items-center gap-2">
                  <FaCar className="size-6" />
                  <span>Carros</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                className={cn(pathname === "/manager/drivers" && "bg-primary text-primary-foreground")}
              >
                <Link href="/manager/drivers" className="flex items-center gap-2">
                  <FaPeopleGroup className="size-6" />
                  <span>Motoristas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
