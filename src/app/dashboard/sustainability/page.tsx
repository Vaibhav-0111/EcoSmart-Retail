// src/app/dashboard/sustainability/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { sustainabilityChartConfig } from "@/lib/mock-data";
import { ArrowUp, Loader2, Wand2, Leaf, Recycle, Droplets, Trees } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useReturns } from "@/hooks/use-returns";
import { Button } from "@/components/ui/button";
import { generateReportAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Remarkable } from 'remarkable';

const md = new Remarkable();

// Define impact multipliers for a more realistic demo
const IMPACT_MULTIPLIERS = {
    resell: { co2: 5, waste: 2.5, water: 50, trees: 0.05 },
    repair: { co2: 3, waste: 2.0, water: 30, trees: 0.02 },
    reuse: { co2: 2, waste: 2.5, water: 20, trees: 0.01 },
    recycle: { co2: 4, waste: 2.2, water: 40, trees: 0.04 },
    landfill: { co2: 0, waste: 0, water: 0, trees: 0 },
}

export default function SustainabilityPage() {
  const { items } = useReturns();
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState("");
  const { toast } = useToast();

  const { sustainabilityImpactMetrics, actionBreakdown, actionBreakdownForChart } = useMemo(() => {
    
    let co2Saved = 0;
    let wasteDiverted = 0;
    let waterSaved = 0;
    let treesSaved = 0;

    const breakdown = items.reduce((acc, item) => {
        const action = item.recommendation || 'landfill';
        if (action !== 'landfill') {
            acc[action] = (acc[action] || 0) + 1;
            co2Saved += IMPACT_MULTIPLIERS[action].co2;
            wasteDiverted += IMPACT_MULTIPLIERS[action].waste;
            waterSaved += IMPACT_MULTIPLIERS[action].water;
            treesSaved += IMPACT_MULTIPLIERS[action].trees;
        }
        return acc;
    }, {} as Record<string, number>);

    const chartData = [
        { action: "Resell", value: breakdown.resell || 0, fill: "var(--color-resell)" },
        { action: "Repair", value: breakdown.repair || 0, fill: "var(--color-repair)" },
        { action: "Reuse", value: breakdown.reuse || 0, fill: "var(--color-reuse)" },
        { action: "Recycle", value: breakdown.recycle || 0, fill: "var(--color-recycle)" },
    ];
    
    return {
      sustainabilityImpactMetrics: [
        { icon: Leaf, title: "CO2 Emissions Saved", value: `${co2Saved.toFixed(1)} kg` },
        { icon: Recycle, title: "Waste Diverted", value: `${wasteDiverted.toFixed(1)} kg` },
        { icon: Droplets, title: "Water Saved", value: `${waterSaved.toFixed(0)} L` },
        { icon: Trees, title: "Trees Saved (Equivalent)", value: `${treesSaved.toFixed(2)}` },
      ],
      actionBreakdown: breakdown,
      actionBreakdownForChart: chartData
    };
  }, [items]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReport("");
    try {
      const input = {
          co2Saved: sustainabilityImpactMetrics[0].value,
          wasteDiverted: sustainabilityImpactMetrics[1].value,
          waterSaved: sustainabilityImpactMetrics[2].value,
          treesSaved: sustainabilityImpactMetrics[3].value,
          actionBreakdown,
      };
      const result = await generateReportAction(input);
      setReport(result.report);
      toast({
          title: "Report Generated!",
          description: "Your sustainability report is ready.",
      });
    } catch (error) {
        console.error(error);
        toast({
            title: "Error Generating Report",
            description: "The AI failed to generate the report.",
            variant: "destructive",
        })
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sustainability Impact</h1>
        <p className="text-muted-foreground">
          Real-time metrics on our positive environmental contributions, based on processed items.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sustainabilityImpactMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">Calculated from all actions</p>
                    </CardContent>
                </Card>
            )
        })}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Sustainability Actions Breakdown</CardTitle>
                <CardDescription>
                    This chart shows the number of items processed for each sustainable action, based on AI recommendations.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <ChartContainer config={sustainabilityChartConfig} className="min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={actionBreakdownForChart}>
                            <CartesianGrid vertical={false} />
                            <XAxis 
                                dataKey="action"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis 
                                allowDecimals={false}
                            />
                            <ChartTooltip 
                                cursor={false} 
                                content={<ChartTooltipContent indicator="dot" />} 
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar 
                                dataKey="value" 
                                radius={4}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>AI-Generated Report</CardTitle>
                    <CardDescription>Generate a narrative report of your sustainability achievements.</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert bg-muted/50 p-4 rounded-lg min-h-[300px] flex-grow">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="size-8 animate-spin text-primary" />
                      <p className="mt-2 text-muted-foreground">AI is drafting your report...</p>
                    </div>
                  ) : report ? (
                     <div dangerouslySetInnerHTML={{ __html: md.render(report) }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-muted-foreground">Click the button below to generate a report based on the current dynamic data.</p>
                    </div>
                  )}
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleGenerateReport} disabled={isGenerating || items.length === 0} className="w-full">
                        {isGenerating ? <Loader2 className="mr-2 size-4 animate-spin"/> : <Wand2 className="mr-2 size-4"/>}
                        {items.length === 0 ? "Add items to generate" : "Generate Report"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
