// src/app/dashboard/layout.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarFooter,
  SidebarGroup,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/dashboard-nav";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { User, Sparkles, Sun, Moon, Droplets, Palette, Leaf } from "lucide-react";
import { ReturnsProvider } from "@/context/ReturnsContext";
import { useReturns } from "@/hooks/use-returns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function HeaderStats() {
    const { items } = useReturns();

    const { totalProcessed, wasteReduced, costSaved } = useMemo(() => {
        const totalProcessed = items.length;
        const savedFromLandfill = items.filter(item => item.recommendation !== 'landfill' && item.recommendation).length;
        const wasteReduced = totalProcessed > 0 ? (savedFromLandfill / totalProcessed) * 100 : 0;
        const costSaved = items.reduce((acc, item) => {
            if (item.recommendation && ['resell', 'repair'].includes(item.recommendation)) {
                return acc + item.value;
            }
            return acc;
        }, 0);
        return { totalProcessed, wasteReduced, costSaved };
    }, [items]);

    return (
        <>
            <div>
                <p className="font-bold text-lg">{totalProcessed}</p>
                <p className="text-xs text-muted-foreground">Items Processed</p>
            </div>
            <div>
                <p className="font-bold text-lg">{wasteReduced.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Waste Reduced</p>
            </div>
             <div>
                <p className="font-bold text-lg">${(costSaved / 1000).toFixed(1)}K</p>
                <p className="text-xs text-muted-foreground">Cost Saved</p>
            </div>
        </>
    );
}

function UserNav() {
  return (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <User className="h-5 w-5" />
    </Button>
  );
}

function ThemeSwitcher() {
  const [theme, setTheme] = useState("theme-forest");

  useEffect(() => {
    // Remove any existing theme classes
    const themeClasses = ["theme-forest", "theme-ocean", "theme-sunset"];
    document.body.classList.remove(...themeClasses);
    // Add the new theme class
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("theme-forest")}>
          <Leaf className="mr-2 h-4 w-4" />
          <span>Forest</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-ocean")}>
          <Droplets className="mr-2 h-4 w-4" />
          <span>Ocean</span>
        </DropdownMenuItem>
         <DropdownMenuItem onClick={() => setTheme("theme-sunset")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Sunset</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


function EcoImpactCard() {
    const { items } = useReturns();

    const { itemsSaved, wasteReduction } = useMemo(() => {
        const itemsSaved = items.filter(item => item.recommendation && item.recommendation !== 'landfill').length;
        const wasteReduction = items.length > 0 ? (itemsSaved / items.length) * 100 : 0;
        return { itemsSaved, wasteReduction };
    }, [items]);

    return (
         <div className="rounded-lg bg-primary/10 p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold text-primary mb-2">
                <Sparkles className="size-5" />
                Eco Impact
            </div>
            <p className="text-muted-foreground">Today: {itemsSaved} items saved from landfill</p>
            <p className="text-muted-foreground">{wasteReduction.toFixed(0)}% waste reduction achieved</p>
        </div>
    );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
    return (
         <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <Icons.logo className="size-8 text-primary" />
                    <div className="group-data-[collapsible=icon]:hidden">
                    <p className="text-lg font-semibold tracking-tight">
                        EcoSmart Retail
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Retail Hackathon 2025
                    </p>
                    </div>
                </div>
                </SidebarHeader>
                <SidebarContent className="p-4">
                <DashboardNav />
                </SidebarContent>
                <SidebarFooter className="p-4">
                <SidebarGroup>
                    <EcoImpactCard />
                </SidebarGroup>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
                <SidebarTrigger className="md:flex hidden" />
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <HeaderStats />
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <UserNav />
                </div>
                </header>
                <main className="flex-1 overflow-auto p-4 sm:p-6 bg-secondary/50">
                {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReturnsProvider>
        <DashboardContent>{children}</DashboardContent>
    </ReturnsProvider>
  );
}
