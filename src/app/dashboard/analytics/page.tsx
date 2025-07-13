// src/app/dashboard/analytics/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useReturns } from "@/hooks/use-returns";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { Timer, TrendingUp, CircleDollarSign, CheckSquare, AlertTriangle, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";
import { revenueByActionChartConfig } from "@/lib/mock-data";
import { getReturnabilityScoreAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ScoreData {
    name: string;
    value: number;
}

const RISK_COLORS = {
  High: "hsl(var(--destructive))",
  Medium: "hsl(var(--chart-4))",
  Low: "hsl(var(--primary))",
};


export default function AnalyticsPage() {
    const { items, catalog } = useReturns();
    const { toast } = useToast();
    const [isScoresLoading, setIsScoresLoading] = useState(false);
    const [scoresData, setScoresData] = useState<ScoreData[] | null>(null);

    const { analyticsMetrics, revenueByActionData } = useMemo(() => {
        const totalProcessed = items.length;
        const successfullyProcessed = items.filter(item => item.recommendation).length;
        const successRate = totalProcessed > 0 ? (successfullyProcessed / totalProcessed) * 100 : 0;
        const revenueRecovered = items.reduce((acc, item) => {
            if (item.recommendation && ['resell', 'repair'].includes(item.recommendation)) {
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

        const revenueData = items.reduce((acc, item) => {
            if (item.recommendation === 'resell') acc.resell += item.value;
            if (item.recommendation === 'repair') acc.repair += item.value * 0.3;
            if (item.recommendation === 'recycle') acc.recycle += 5; 
            return acc;
        }, { month: 'Current', resell: 0, repair: 0, recycle: 0 });


        return { analyticsMetrics, revenueByActionData: [revenueData] };

    }, [items]);
    
    const handleGetScores = async () => {
        setIsScoresLoading(true);
        try {
            const result = await getReturnabilityScoreAction({
                productCatalog: JSON.stringify(catalog),
                returnHistory: JSON.stringify(items),
            });
            
            const counts = result.scores.reduce((acc, score) => {
                acc[score.returnRisk] = (acc[score.returnRisk] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            setScoresData([
                { name: 'High', value: counts.High || 0 },
                { name: 'Medium', value: counts.Medium || 0 },
                { name: 'Low', value: counts.Low || 0 },
            ]);

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to load returnability scores.",
                variant: "destructive",
            });
        } finally {
            setIsScoresLoading(false);
        }
    };
    
    const RiskIcon = ({name}: {name: string}) => {
        if (name === 'High') return <AlertTriangle className="mr-2 size-4 text-destructive" />;
        if (name === 'Medium') return <HelpCircle className="mr-2 size-4 text-yellow-500" />;
        return <ShieldCheck className="mr-2 size-4 text-green-600" />;
    };

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
             <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <CardTitle>Product Returnability Scores</CardTitle>
                    <CardDescription>
                      AI-assessed risk of products being returned.
                    </CardDescription>
                </div>
                <Button size="sm" onClick={handleGetScores} disabled={isScoresLoading}>
                    {isScoresLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Refresh Scores
                </Button>
            </div>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-center h-[300px] text-center">
                {isScoresLoading ? (
                    <Loader2 className="size-12 animate-spin text-primary" />
                ) : scoresData ? (
                    <ChartContainer config={{}} className="min-h-[300px] w-full">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                            <Pie data={scoresData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                                {scoresData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS]} />
                                ))}
                            </Pie>
                             <ChartLegend
                                content={({ payload }) => (
                                <ul className="flex flex-wrap justify-center gap-4 mt-4">
                                    {payload?.map((entry) => (
                                    <li key={entry.value} className="flex items-center text-sm font-medium">
                                        <RiskIcon name={entry.value as string} />
                                        {entry.value} Risk: {(entry.payload as any).value} products
                                    </li>
                                    ))}
                                </ul>
                                )}
                            />
                        </PieChart>
                    </ChartContainer>
                ) : (
                    <div className="flex flex-col items-center">
                        <AlertTriangle className="size-12 text-muted-foreground" />
                        <p className="mt-4 font-semibold">No score data loaded</p>
                        <p className="text-sm text-muted-foreground">Click "Refresh Scores" to analyze your catalog.</p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
