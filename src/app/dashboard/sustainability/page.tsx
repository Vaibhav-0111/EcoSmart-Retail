// src/app/dashboard/sustainability/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { co2SavedData, co2SavedChartConfig, sustainabilityImpactMetrics } from "@/lib/mock-data";
import { ArrowUp } from "lucide-react";
import React from "react";

export default function SustainabilityPage() {
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
  );
}
