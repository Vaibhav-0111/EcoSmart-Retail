// src/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useReturns } from "@/hooks/use-returns";
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
import { ArrowUpRight, Bot, Box, DollarSign, Leaf, Package, Recycle, Sparkles, BarChart, Sprout, Wrench, Repeat } from "lucide-react";
import type { ReturnedItem } from "@/lib/types";

const recommendationIcons: { [key: string]: React.ReactNode } = {
  repair: <Wrench className="size-3 mr-1" />,
  recycle: <Recycle className="size-3 mr-1" />,
  resell: <DollarSign className="size-3 mr-1" />,
};

const recommendationBadges: { [key: string]: string } = {
    resell: "text-amber-600 border-amber-200 bg-amber-50",
    recycle: "text-blue-600 border-blue-200 bg-blue-50",
    repair: "text-orange-600 border-orange-200 bg-orange-50",
};


export default function DashboardOverview() {
  const { items } = useReturns();

  const { totalReturns, itemsRedirected, costSavings, wasteReduction, recentReturns } = useMemo(() => {
    const totalReturns = items.length;
    
    const itemsRedirected = items.filter(item => item.recommendation && item.recommendation !== 'landfill').length;

    const costSavings = items.reduce((acc, item) => {
        if (item.recommendation && ['resell', 'repair', 'reuse'].includes(item.recommendation)) {
            return acc + item.value;
        }
        return acc;
    }, 0);

    const wasteReduction = totalReturns > 0 ? (itemsRedirected / totalReturns) * 100 : 0;
    
    const recentReturns = [...items].sort((a, b) => (b.id > a.id ? 1 : -1)).slice(0, 5);
    
    return { totalReturns, itemsRedirected, costSavings, wasteReduction, recentReturns };
  }, [items]);
  
  const actionBreakdown = useMemo(() => {
    return items.reduce((acc, item) => {
      if(item.recommendation) {
        acc[item.recommendation] = (acc[item.recommendation] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [items])

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <div className="flex flex-wrap items-center justify-between p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome to EcoSmart Retail</h1>
                <p className="text-primary-foreground/80">
                AI-powered sustainable retail operations.
                </p>
                <div className="flex items-center gap-2 pt-2">
                    <Badge variant="secondary" className="gap-2 bg-white/20 border-0 text-white"><Leaf className="size-3"/> {wasteReduction.toFixed(0)}% Waste Reduction</Badge>
                    <Badge variant="secondary" className="gap-2 bg-white/20 border-0 text-white"><Bot className="size-3"/> AI-Powered Insights</Badge>
                    <Badge variant="secondary" className="gap-2 bg-white/20 border-0 text-white"><Sprout className="size-3"/> Hackathon 2025</Badge>
                </div>
            </div>
            <div className="text-right">
                <p className="text-5xl font-bold">${(costSavings / 1000).toFixed(1)}K</p>
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
            <div className="text-3xl font-bold">{totalReturns}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
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
            <div className="text-3xl font-bold">{itemsRedirected}</div>
            <p className="text-xs text-muted-foreground">Saved from landfill</p>
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
            <div className="text-3xl font-bold">${costSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Revenue recovered</p>
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
            <div className="text-3xl font-bold">{wasteReduction.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Environmental impact</p>
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
                    {recentReturns.length > 0 ? recentReturns.map((item: ReturnedItem) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.id} • <span className="capitalize">{item.category}</span></p>
                            </TableCell>
                            <TableCell><Badge variant={item.condition === 'damaged' ? 'destructive' : 'secondary'} className="capitalize">{item.condition}</Badge></TableCell>
                            <TableCell>
                                {item.recommendation ? (
                                    <Badge variant="outline" className={`capitalize ${recommendationBadges[item.recommendation]}`}>
                                        {recommendationIcons[item.recommendation]}
                                        {item.recommendation}
                                    </Badge>
                                ) : <span className="text-muted-foreground text-xs">Awaiting AI</span>}
                            </TableCell>
                            <TableCell className="text-right font-medium">${item.value.toFixed(2)}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No recent returns. Add one from the Returns Management page.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Sustainability Impact</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-4xl font-bold text-primary">{totalReturns}</p>
                <p className="text-sm text-muted-foreground">Total Items Processed</p>
                <p className="text-4xl font-bold text-primary mt-4">{wasteReduction.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Waste Reduction</p>

                <div className="mt-6">
                    <p className="font-semibold mb-2">Action Breakdown</p>
                    <div className="flex justify-center gap-4 text-xs">
                        {Object.entries(actionBreakdown).map(([action, count]) => (
                             <div key={action} className="flex items-center gap-1 capitalize">
                                <div className={`size-2 rounded-full ${action === 'resell' ? 'bg-amber-500' : action === 'repair' ? 'bg-orange-500' : action === 'recycle' ? 'bg-blue-500' : 'bg-indigo-500'}`}/>
                                {action} ({count})
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
