// src/app/dashboard/forecasting/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useReturns } from "@/hooks/use-returns";
import { forecastReturnsAction } from "@/app/actions";
import { Loader2, Sparkles, TrendingUp, TrendingDown, Minus, BarChart, FileText } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface Forecast {
  category: "electronics" | "clothing" | "home goods" | "toys" | "other";
  forecastedReturns: number;
  trend: "up" | "down" | "stable";
  reasoning: string;
}

const trendIcons = {
    up: <TrendingUp className="size-5 text-destructive" />,
    down: <TrendingDown className="size-5 text-green-600" />,
    stable: <Minus className="size-5 text-muted-foreground" />,
}

const categoryFills: { [key in Forecast['category']]: string } = {
    electronics: "hsl(var(--chart-1))",
    clothing: "hsl(var(--chart-2))",
    "home goods": "hsl(var(--chart-3))",
    toys: "hsl(var(--chart-4))",
    other: "hsl(var(--chart-5))",
}


export default function ForecastingPage() {
  const { toast } = useToast();
  const { items } = useReturns();
  const [isLoading, setIsLoading] = useState(false);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  const handleGetForecasts = async () => {
    setIsLoading(true);
    setForecasts([]);
    try {
        if (items.length < 5) { // Need some data to forecast
            toast({
                title: "Not Enough Data",
                description: "Please add at least 5 returned items to generate a forecast.",
                variant: "destructive"
            });
            setIsLoading(false);
            return;
        }
        const result = await forecastReturnsAction({ historicalReturns: JSON.stringify(items) });
        setForecasts(result.forecasts);
        toast({
            title: "Forecast Generated",
            description: "AI-powered return forecasts for the next 7 days are ready.",
        });
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to get forecasts from the AI.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const chartData = forecasts.map(f => ({
      name: f.category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      returns: f.forecastedReturns,
      fill: categoryFills[f.category]
  }));

  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Returns Forecasting</h1>
            <p className="text-muted-foreground">
                Predict future return volumes by category using AI analysis.
            </p>
        </div>
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <CardTitle>7-Day Returns Forecast</CardTitle>
                        <CardDescription>
                            Use historical data to predict upcoming return patterns and prepare your operations.
                        </CardDescription>
                    </div>
                     <Button onClick={handleGetForecasts} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Generate 7-Day Forecast
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">AI is analyzing historical data and predicting future trends...</p>
                    </div>
                )}

                {!isLoading && forecasts.length === 0 && (
                     <div className="flex flex-col items-center justify-center p-16 text-center">
                        <BarChart className="size-16 text-muted-foreground"/>
                        <p className="mt-4 font-semibold">No forecast available</p>
                        <p className="text-sm text-muted-foreground">Click "Generate 7-Day Forecast" to get started.</p>
                    </div>
                )}
                
                {!isLoading && forecasts.length > 0 && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                             <h3 className="text-lg font-semibold mb-4">Predicted Returns by Category</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                <RechartsBarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{
                                            background: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "var(--radius)"
                                        }}
                                    />
                                    <Bar dataKey="returns" fill="var(--color-primary)" />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                             <h3 className="text-lg font-semibold">Category Trends & Insights</h3>
                             {forecasts.map(f => (
                                <Card key={f.category} className="p-4 bg-muted/50">
                                   <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold capitalize">{f.category}</p>
                                            <p className="text-sm text-muted-foreground">{f.reasoning}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {trendIcons[f.trend]}
                                            <span className="text-lg font-bold">{f.forecastedReturns}</span>
                                        </div>
                                   </div>
                                </Card>
                             ))}
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    </div>
  );
}
