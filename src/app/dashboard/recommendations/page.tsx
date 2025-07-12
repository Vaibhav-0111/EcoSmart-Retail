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
import { getRecommendationsAction } from "@/app/actions";
import { Loader2, Sparkles, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Recommendation {
    id: string;
    type: "inventory" | "supply chain";
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
    confidence: number;
}

export default function RecommendationsPage() {
  const { toast } = useToast();
  const { items } = useReturns();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations([]);
    try {
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
        setIsLoading(false);
    }
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
                        Proactive suggestions to improve efficiency and reduce costs based on returns data.
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
                        {!isLoading && recommendations.length === 0 && (
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
