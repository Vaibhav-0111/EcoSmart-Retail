"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { mockReturnedItems, sustainabilityMetrics, sustainabilityChartConfig } from "@/lib/mock-data";
import { getRecommendationAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { ReturnedItem } from "@/lib/types";
import type { RecommendReturnedItemActionOutput } from "@/ai/flows/recommend-returned-item-action";
import { Loader2, Package, Recycle, Wrench, Repeat, DollarSign, Wand2 } from "lucide-react";

const recommendationIcons = {
  reuse: <Repeat className="h-8 w-8 text-blue-500" />,
  repair: <Wrench className="h-8 w-8 text-orange-500" />,
  recycle: <Recycle className="h-8 w-8 text-green-500" />,
  resell: <DollarSign className="h-8 w-8 text-yellow-500" />,
};

export default function LogisticsPage() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendReturnedItemActionOutput | null>(null);
  const { toast } = useToast();

  const selectedItem = mockReturnedItems.find((item) => item.id === selectedItemId);

  const handleGetRecommendation = async () => {
    if (!selectedItem) {
      toast({
        title: "No item selected",
        description: "Please select an item from the list to get a recommendation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecommendation(null);

    try {
      const result = await getRecommendationAction({
        itemDescription: selectedItem.name,
        itemCondition: selectedItem.condition,
        itemCategory: selectedItem.category,
        returnReason: selectedItem.returnReason,
      });
      setRecommendation(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to get a recommendation from the AI.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Returned Items</CardTitle>
            <CardDescription>
              Select an item to view details and get an AI-powered action recommendation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedItemId || ""} onValueChange={setSelectedItemId}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReturnedItems.map((item) => (
                    <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelectedItemId(item.id)}>
                      <TableCell>
                        <RadioGroupItem value={item.id} id={item.id} />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.condition === 'damaged' ? 'destructive' : 'secondary'} className="capitalize">{item.condition}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </RadioGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sustainability Metrics</CardTitle>
            <CardDescription>Overview of actions taken on returned items.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sustainabilityChartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={sustainabilityMetrics}>
                <XAxis dataKey="action" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="value" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Action Recommender</CardTitle>
            <CardDescription>Let AI suggest the most sustainable action for the selected item.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedItem ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.returnReason}</p>
                </div>
                <Button onClick={handleGetRecommendation} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Get Recommendation
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <Package className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Select an item to get started</p>
              </div>
            )}
            
            {isLoading && (
               <div className="flex flex-col items-center justify-center text-center p-8">
                 <Loader2 className="h-12 w-12 text-primary animate-spin" />
                 <p className="mt-4 text-muted-foreground">AI is thinking...</p>
               </div>
            )}

            {recommendation && (
              <div className="pt-4 border-t">
                <Card className="bg-accent/20">
                  <CardHeader className="items-center text-center">
                    <div className="p-3 bg-background rounded-full">
                        {recommendationIcons[recommendation.recommendedAction]}
                    </div>
                    <CardTitle className="capitalize text-2xl text-primary">{recommendation.recommendedAction}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">{recommendation.reasoning}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
