// src/app/dashboard/recommendations/page.tsx
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
import { getRecommendationsAction, forecastReturnsAction } from "@/app/actions";
import { Loader2, Sparkles, AlertTriangle, CheckCircle, FileText, Tag, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';


interface Recommendation {
    id: string;
    type: "inventory" | "supply chain" | "product quality" | "customer experience";
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
    confidence: number;
    relatedProduct?: string;
}

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


export default function RecommendationsPage() {
  const { toast } = useToast();
  const { items } = useReturns();
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  const handleGetRecommendations = async () => {
    setIsRecLoading(true);
    setRecommendations([]);
    try {
        if (items.length === 0) {
            toast({
                title: "No Data to Analyze",
                description: "Please add some returned items before generating recommendations.",
                variant: "destructive"
            });
            setIsRecLoading(false);
            return;
        }
        const result = await getRecommendationsAction({ returnedItems: JSON.stringify(items) });
        setRecommendations(result.recommendations);
        toast({
            title: "Recommendations Refreshed",
            description: "New inventory and supply chain recommendations are available.",
        });
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to get recommendations from the AI.",
            variant: "destructive",
        });
    } finally {
        setIsRecLoading(false);
    }
  };

  const handleGetForecasts = async () => {
    setIsForecastLoading(true);
    setForecasts([]);
    try {
        if (items.length < 5) { // Need some data to forecast
            toast({
                title: "Not Enough Data",
                description: "Please add at least 5 returned items to generate a forecast.",
                variant: "destructive"
            });
            setIsForecastLoading(false);
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
        setIsForecastLoading(false);
    }
  };

  const getImpactStyles = (impact: "High" | "Medium" | "Low") => {
    switch (impact) {
      case "High":
        return "text-destructive font-semibold";
      case "Medium":
        return "text-yellow-600 font-semibold";
      case "Low":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const forecastChartData = forecasts.map(f => ({
      name: f.category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      returns: f.forecastedReturns,
      fill: categoryFills[f.category]
  }));

  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Analytics & Recommendations</h1>
            <p className="text-muted-foreground">
            Get AI-powered suggestions, forecasts, and strategic insights based on your returns data.
            </p>
        </div>
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <CardTitle>Inventory & Supply Chain Recommendations</CardTitle>
                        <CardDescription>
                        Proactive suggestions to improve efficiency and reduce costs.
                        </CardDescription>
                    </div>
                     <Button onClick={handleGetRecommendations} disabled={isRecLoading}>
                        {isRecLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Get Fresh Recommendations
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Type</TableHead>
                            <TableHead>Recommendation</TableHead>
                            <TableHead className="w-[120px]">Impact</TableHead>
                            <TableHead className="w-[150px]">Confidence</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isRecLoading && recommendations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <FileText className="size-12 text-muted-foreground"/>
                                        <p className="text-muted-foreground">No recommendations yet.</p>
                                        <p className="text-sm text-muted-foreground">Click "Get Fresh Recommendations" to have the AI analyze your data.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {recommendations.map((rec) => (
                            <TableRow key={rec.id}>
                                <TableCell>
                                    <Badge variant={rec.type === 'inventory' ? 'secondary' : rec.type === 'supply chain' ? 'outline' : 'default'} className="capitalize">{rec.type.replace(/_/g, " ")}</Badge>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{rec.title}</p>
                                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                                    {rec.relatedProduct && (
                                        <div className="flex items-center gap-2 mt-2">
                                           <Tag className="size-3 text-muted-foreground" />
                                           <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{rec.relatedProduct}</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className={`flex items-center gap-2 ${getImpactStyles(rec.impact)}`}>
                                        {rec.impact === "High" && <AlertTriangle className="size-4" />}
                                        {rec.impact}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                                        <CheckCircle className="size-4"/>
                                        {rec.confidence}%
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {isRecLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Analyzing data and generating new recommendations...</p>
                    </div>
                )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <CardTitle>7-Day Returns Forecast</CardTitle>
                        <CardDescription>
                            Predict future return volumes by category to prepare your operations.
                        </CardDescription>
                    </div>
                     <Button onClick={handleGetForecasts} disabled={isForecastLoading}>
                        {isForecastLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Generate 7-Day Forecast
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isForecastLoading && (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">AI is analyzing historical data and predicting future trends...</p>
                    </div>
                )}

                {!isForecastLoading && forecasts.length === 0 && (
                     <div className="flex flex-col items-center justify-center p-16 text-center">
                        <RechartsBarChart className="size-16 text-muted-foreground"/>
                        <p className="mt-4 font-semibold">No forecast available</p>
                        <p className="text-sm text-muted-foreground">Click "Generate 7-Day Forecast" to get started.</p>
                    </div>
                )}
                
                {!isForecastLoading && forecasts.length > 0 && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                             <h3 className="text-lg font-semibold mb-4">Predicted Returns by Category</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                <RechartsBarChart data={forecastChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                                    <Bar dataKey="returns" fill="fill" />
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
