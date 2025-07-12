// src/app/dashboard/analytics/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import {
    analyticsMetrics,
    revenueByActionData,
    revenueByActionChartConfig,
    processingTimeData,
    processingTimeChartConfig
} from "@/lib/mock-data";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
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
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
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
            <ChartContainer config={processingTimeChartConfig} className="min-h-[300px] w-full">
                <LineChart
                    accessibilityLayer
                    data={processingTimeData}
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
                    tickMargin={8}
                    tickFormatter={(value) => `${value}h`}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                    dataKey="time"
                    type="monotone"
                    stroke="var(--color-time)"
                    strokeWidth={2}
                    dot={true}
                    />
                </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
