// src/app/dashboard/sustainability/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { co2SavedData, co2SavedChartConfig, sustainabilityImpactMetrics as mockMetrics } from "@/lib/mock-data";
import { ArrowUp, Loader2, Wand2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useReturns } from "@/hooks/use-returns";
import { Button } from "@/components/ui/button";
import { generateReportAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function SustainabilityPage() {
  const { items } = useReturns();
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState("");
  const { toast } = useToast();

  const { sustainabilityImpactMetrics, actionBreakdown } = useMemo(() => {
    const co2Saved = items.length * 1.25; // Dummy calculation
    const wasteDiverted = items.filter(item => item.recommendation !== 'landfill').length * 2.5; // Dummy calculation
    const waterSaved = items.length * 45; // Dummy calculation
    const treesSaved = items.length * 0.035; // Dummy calculation
    
    const actionBreakdown = items.reduce((acc, item) => {
        if(item.recommendation) {
            acc[item.recommendation] = (acc[item.recommendation] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return {
      sustainabilityImpactMetrics: [
        { ...mockMetrics[0], value: `${co2Saved.toFixed(0)} kg` },
        { ...mockMetrics[1], value: `${wasteDiverted.toFixed(0)} kg` },
        { ...mockMetrics[2], value: `${waterSaved.toFixed(0)} L` },
        { ...mockMetrics[3], value: `${treesSaved.toFixed(0)}` },
      ],
      actionBreakdown,
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
          Detailed metrics on our positive environmental contributions.
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
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                        <div className="flex items-center gap-1 text-xs text-green-600 font-semibold pt-2">
                            <ArrowUp className="size-4" />
                            <span>{metric.trend}</span>
                        </div>
                    </CardContent>
                </Card>
            )
        })}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>CO2 Emissions Saved Over Time</CardTitle>
                <CardDescription>
                    This chart illustrates the cumulative carbon dioxide emissions (in kilograms) saved through our sustainability initiatives.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <ChartContainer config={co2SavedChartConfig} className="min-h-[300px] w-full">
                    <AreaChart
                    accessibilityLayer
                    data={co2SavedData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                    >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `${value} kg`}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                        dataKey="co2"
                        type="natural"
                        fill="var(--color-co2)"
                        fillOpacity={0.4}
                        stroke="var(--color-co2)"
                        stackId="a"
                    />
                    </AreaChart>
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
                      <p className="text-muted-foreground">Click the button below to generate a report.</p>
                    </div>
                  )}
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
                        {isGenerating ? <Loader2 className="mr-2 size-4 animate-spin"/> : <Wand2 className="mr-2 size-4"/>}
                        Generate Report
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
