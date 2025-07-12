"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Home, LayoutDashboard, Recycle } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";

const links = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard />,
  },
  {
    href: "/dashboard/logistics",
    label: "Logistics",
    icon: <Recycle />,
  },
  {
    href: "/dashboard/assistant",
    label: "Assistant",
    icon: <Bot />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Landing Page">
          <Link href="/">
            <Home />
            <span>Home</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
