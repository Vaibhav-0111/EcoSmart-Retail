// src/app/dashboard/recommendations/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { inventoryRecommendations } from "@/lib/mock-data";

export default function RecommendationsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(inventoryRecommendations);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    // In a real app, you would call an AI action here.
    // We'll just simulate a delay.
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRecommendations(inventoryRecommendations); // Resetting to mock data
    toast({
        title: "Recommendations Refreshed",
        description: "New inventory and supply chain recommendations are available.",
    });
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
            <p className="text-muted-foreground">
            Get AI-powered suggestions for inventory management and supply chain optimization.
            </p>
        </div>
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Inventory & Supply Chain</CardTitle>
                        <CardDescription>
                        Proactive suggestions to improve efficiency and reduce costs.
                        </CardDescription>
                    </div>
                     <Button onClick={handleGetRecommendations} disabled={isLoading}>
                        {isLoading ? (
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
                            <TableHead>Type</TableHead>
                            <TableHead>Recommendation</TableHead>
                            <TableHead>Impact</TableHead>
                            <TableHead>Confidence</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recommendations.map((rec) => (
                            <TableRow key={rec.id}>
                                <TableCell>
                                    <Badge variant={rec.type === 'inventory' ? 'secondary' : 'outline'} className="capitalize">{rec.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{rec.title}</p>
                                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                                </TableCell>
                                <TableCell>
                                    {rec.impact === "High" && <span className="flex items-center gap-2 text-destructive"><AlertTriangle className="size-4" /> {rec.impact}</span>}
                                    {rec.impact === "Medium" && <span className="flex items-center gap-2 text-yellow-600">{rec.impact}</span>}
                                    {rec.impact === "Low" && <span className="flex items-center gap-2 text-muted-foreground">{rec.impact}</span>}
                                </TableCell>
                                <TableCell>
                                    <span className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="size-4"/>
                                        {rec.confidence}%
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Analyzing data and generating new recommendations...</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
