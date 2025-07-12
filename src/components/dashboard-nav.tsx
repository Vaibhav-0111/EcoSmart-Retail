"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Recycle, Sparkles, BarChart, Sprout } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Overview & Analytics",
    icon: <LayoutDashboard />,
  },
  {
    href: "/dashboard/logistics",
    label: "Returns Management",
    description: "Track & Process Returns",
    icon: <Recycle />,
  },
  {
    href: "/dashboard/assistant",
    label: "AI Assistant",
    description: "Smart Shopping Guide",
    icon: <Bot />,
  },
    {
    href: "#",
    label: "Sustainability",
    description: "Environmental Impact",
    icon: <Sprout />,
  },
  {
    href: "#",
    label: "Analytics",
    description: "Performance Insights",
    icon: <BarChart />,
  },
    {
    href: "#",
    label: "Recommendations",
    description: "AI-Powered Suggestions",
    icon: <Sparkles />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                className="h-auto flex-col items-start p-3 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            >
                <Link href="/dashboard">
                    <div className="flex items-center gap-3">
                        {links[0].icon}
                        <div className="flex flex-col">
                            <span className="font-semibold">{links[0].label}</span>
                            <span className="text-xs">{links[0].description}</span>
                        </div>
                    </div>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      
      {links.slice(1).map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(link.href) && link.href !== "/"}
            className="h-auto flex-col items-start p-3 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
          >
            <Link href={link.href}>
                 <div className="flex items-center gap-3">
                    {link.icon}
                     <div className="flex flex-col">
                        <span className="font-semibold">{link.label}</span>
                        <span className="text-xs">{link.description}</span>
                    </div>
                </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
