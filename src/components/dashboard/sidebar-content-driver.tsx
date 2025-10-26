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
import { GiMeal } from "react-icons/gi";
import { IoMdSpeedometer } from "react-icons/io";

export function SidebarContentDriver() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className={cn(pathname === "/driver" && "bg-primary text-primary-foreground")}>
                <Link href="/driver" className="flex items-center gap-2">
                  <LayoutDashboardIcon className="size-6" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className={cn(pathname === "/driver/mileage" && "bg-primary text-primary-foreground")}>
                <Link href="/driver/mileage" className="flex items-center gap-2">
                  <IoMdSpeedometer className="size-6" />
                  <span>Kilometragem</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className={cn(pathname === "/driver/food" && "bg-primary text-primary-foreground")}>
                <Link href="/driver/food" className="flex items-center gap-2">
                  <GiMeal className="size-6" />
                  <span>Alimentação</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
