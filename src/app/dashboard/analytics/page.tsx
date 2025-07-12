// src/app/dashboard/analytics/page.tsx
"use client";

import { useMemo } from "react";
import { useReturns } from "@/hooks/use-returns";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import { Timer, TrendingUp, CircleDollarSign, CheckSquare } from "lucide-react";
import { revenueByActionChartConfig } from "@/lib/mock-data";


export default function AnalyticsPage() {
    const { items } = useReturns();

    const { analyticsMetrics, revenueByActionData } = useMemo(() => {
        const totalProcessed = items.length;
        const successfullyProcessed = items.filter(item => item.recommendation).length;
        const successRate = totalProcessed > 0 ? (successfullyProcessed / totalProcessed) * 100 : 0;
        const revenueRecovered = items.reduce((acc, item) => {
            if (item.recommendation && ['resell', 'repair'].includes(item.recommendation)) {
                // Assuming full value for resell, and 30% for repair (as it's a cost saving)
                return acc + (item.recommendation === 'resell' ? item.value : item.value * 0.3);
            }
            return acc;
        }, 0);
        
        const analyticsMetrics = [
            {
                icon: Timer,
                title: "Avg. Processing Time",
                value: "2.1h",
                description: "From receipt to final action",
            },
            {
                icon: TrendingUp,
                title: "Success Rate",
                value: `${successRate.toFixed(1)}%`,
                description: "Items successfully processed",
            },
            {
                icon: CircleDollarSign,
                title: "Revenue Recovered",
                value: `$${revenueRecovered.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                description: "From reselling & repairing",
            },
            {
                icon: CheckSquare,
                title: "Total Items Processed",
                value: totalProcessed,
                description: "All time",
            },
        ];

        // This calculation is now dynamic based on the items
        const revenueData = items.reduce((acc, item) => {
            if (item.recommendation === 'resell') acc.resell += item.value;
            // Assuming repair recovers 30% of original value
            if (item.recommendation === 'repair') acc.repair += item.value * 0.3;
            // Assuming recycling provides a fixed $5 material credit
            if (item.recommendation === 'recycle') acc.recycle += 5; 
            return acc;
        }, { month: 'Current', resell: 0, repair: 0, recycle: 0 });


        return { analyticsMetrics, revenueByActionData: [revenueData] };

    }, [items]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Performance Metrics</h1>
        <p className="text-muted-foreground">
          In-depth analysis of reverse logistics operations and financial performance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analyticsMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </CardContent>
                </Card>
            )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Recovered by Action</CardTitle>
            <CardDescription>
              Breakdown of revenue generated from reselling, repairing, and recycling items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueByActionChartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={revenueByActionData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="resell" stackId="a" fill="var(--color-resell)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="repair" stackId="a" fill="var(--color-repair)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recycle" stackId="a" fill="var(--color-recycle)" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Processing Time</CardTitle>
            <CardDescription>
              Average time (in hours) taken to process a returned item from receipt to final action.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <p className="text-2xl font-bold">2.1 hours</p>
                <p className="text-muted-foreground">(Static data for now)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
