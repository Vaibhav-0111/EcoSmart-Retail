import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Bot, Box, DollarSign, Leaf, Package, Recycle, Sparkles, BarChart, Sprout } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <div className="flex flex-wrap items-center justify-between p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome to EcoSmart Retail</h1>
                <p className="text-primary-foreground/80">
                AI-powered sustainable retail operations for Walmart
                </p>
                <div className="flex items-center gap-2 pt-2">
                    <Badge variant="secondary" className="gap-2 bg-white/20 border-0 text-white"><Leaf className="size-3"/> 89% Waste Reduction</Badge>
                    <Badge variant="secondary" className="gap-2 bg-white/20 border-0 text-white"><Bot className="size-3"/> AI-Powered Insights</Badge>
                    <Badge variant="secondary" className="gap-2 bg-white/20 border-0 text-white"><Sprout className="size-3"/> Hackathon 2025</Badge>
                </div>
            </div>
            <div className="text-right">
                <p className="text-5xl font-bold">$47.2K</p>
                <p className="text-primary-foreground/80">Cost Savings This Month</p>
            </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
             <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Box className="size-5" /></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold pt-2">
                <ArrowUpRight className="size-4" />
                <span>+12.5%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Items Redirected</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Recycle className="size-5" /></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,534</div>
            <p className="text-xs text-muted-foreground">Saved from landfill</p>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold pt-2">
                <ArrowUpRight className="size-4" />
                <span>+18.2%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><DollarSign className="size-5" /></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$47,230</div>
            <p className="text-xs text-muted-foreground">Revenue recovered</p>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold pt-2">
                <ArrowUpRight className="size-4" />
                <span>+23.1%</span>
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Leaf className="size-5" /></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89.2%</div>
            <p className="text-xs text-muted-foreground">Environmental impact</p>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold pt-2">
                <ArrowUpRight className="size-4" />
                <span>+5.4%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Recent Returns</CardTitle>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/logistics">View All Returns</Link>
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>AI Recommendation</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <p className="font-medium">iPhone 14 Pro</p>
                            <p className="text-xs text-muted-foreground">RTN-001 • Electronics</p>
                        </TableCell>
                        <TableCell><Badge variant="secondary">Like New</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50"><DollarSign className="size-3 mr-1" /> Resell</Badge></TableCell>
                        <TableCell className="text-right font-medium">$899</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>
                            <p className="font-medium">Nike Air Max</p>
                            <p className="text-xs text-muted-foreground">RTN-002 • Footwear</p>
                        </TableCell>
                        <TableCell><Badge variant="secondary">Used</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50"><Recycle className="size-3 mr-1" /> Recycle</Badge></TableCell>
                        <TableCell className="text-right font-medium">$120</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Sustainability Impact</CardTitle>
                    <Badge variant="outline">+18% this month</Badge>
                </div>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-4xl font-bold text-primary">2,847</p>
                <p className="text-sm text-muted-foreground">Total Items Processed</p>
                <p className="text-4xl font-bold text-primary mt-4">89.2%</p>
                <p className="text-sm text-muted-foreground">Waste Reduction</p>

                <div className="mt-6">
                    <p className="font-semibold mb-2">Action Breakdown</p>
                    <div className="flex justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-blue-500"/>Resell</div>
                        <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-orange-500"/>Repair</div>
                        <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-green-500"/>Recycle</div>
                        <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-yellow-500"/>Reuse</div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
