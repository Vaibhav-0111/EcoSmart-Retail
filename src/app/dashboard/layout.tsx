import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/dashboard-nav";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Bell, Cog, Sparkles, Sprout } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Icons.logo className="size-8 text-primary" />
            <div>
              <p className="text-lg font-semibold tracking-tight">
                EcoSmart Retail
              </p>
              <p className="text-xs text-muted-foreground">
                Walmart Hackathon 2025
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <DashboardNav />
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarGroup>
            <div className="rounded-lg bg-primary/10 p-4 text-sm">
                <div className="flex items-center gap-2 font-semibold text-primary mb-2">
                    <Sparkles className="size-5" />
                    Eco Impact
                </div>
                <p className="text-muted-foreground">Today: 156 items saved from landfill</p>
                <p className="text-muted-foreground">89% waste reduction achieved</p>
            </div>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <div>
                <p className="font-bold text-lg">2,847</p>
                <p className="text-xs text-muted-foreground">Items Processed</p>
            </div>
            <div>
                <p className="font-bold text-lg">89%</p>
                <p className="text-xs text-muted-foreground">Waste Reduced</p>
            </div>
             <div>
                <p className="font-bold text-lg">$47.2K</p>
                <p className="text-xs text-muted-foreground">Cost Saved</p>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" className="gap-2">
                <Sprout className="size-4" />
                Live Demo
             </Button>
             <Button variant="ghost" size="icon">
                <Bell className="size-5" />
                <span className="sr-only">Notifications</span>
             </Button>
             <Button variant="ghost" size="icon">
                <Cog className="size-5" />
                <span className="sr-only">Settings</span>
             </Button>
             <Button size="sm">Demo Mode</Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-secondary/50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
