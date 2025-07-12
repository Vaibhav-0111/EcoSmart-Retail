// src/app/dashboard/logistics/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useReturns } from "@/hooks/use-returns";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { sustainabilityChartConfig } from "@/lib/mock-data";
import { getRecommendationAction, identifyProductAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { ReturnedItem } from "@/lib/types";
import { Loader2, Package, Recycle, Wrench, Repeat, DollarSign, Wand2, PlusCircle, Camera, SparklesIcon, Bot } from "lucide-react";
import { useMemo } from "react";
import { AiDiagnosticChat } from "@/components/ai-diagnostic-chat";

const recommendationIcons = {
  reuse: <Repeat className="h-8 w-8 text-blue-500" />,
  repair: <Wrench className="h-8 w-8 text-orange-500" />,
  recycle: <Recycle className="h-8 w-8 text-green-500" />,
  resell: <DollarSign className="h-8 w-8 text-yellow-500" />,
  landfill: <Package className="h-8 w-8 text-gray-500" />,
};

const defaultNewItemState: Omit<ReturnedItem, 'id'> = { name: '', category: 'electronics', condition: 'new', returnReason: '', value: 0 };


export default function LogisticsPage() {
  const { items, addItem, updateItem } = useReturns();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ReturnedItem, 'id'>>(defaultNewItemState);
  const [isScanning, setIsScanning] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAddDialogOpen) {
      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           setHasCameraPermission(false);
           return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
        }
      };
      getCameraPermission();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isAddDialogOpen]);

  const handleIdentifyProduct = async () => {
    if (!videoRef.current) return;
    setIsScanning(true);
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');

        try {
            const result = await identifyProductAction({ photoDataUri: dataUri });
            setNewItem(prev => ({...prev, name: result.productName, category: result.category as any, value: result.estimatedValue}));
             toast({
                title: "Product Identified!",
                description: "The AI has pre-filled the item details for you.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Identification Failed",
                description: "The AI could not identify the product from the image.",
                variant: "destructive",
            });
        }
    }
    
    setIsScanning(false);
  }

  const handleAddItem = () => {
      addItem(newItem);
      setIsAddDialogOpen(false);
      setNewItem(defaultNewItemState);
      toast({
          title: "Item Added",
          description: `${newItem.name} has been added to the returns list.`,
      });
  }

  const handleAiDiagnoseComplete = (item: Omit<ReturnedItem, 'id'>) => {
    addItem(item);
    setIsAiChatOpen(false);
    toast({
      title: "Item Added by AI",
      description: `${item.name} has been diagnosed and added to the list.`
    });
  }


  const selectedItem = items.find((item) => item.id === selectedItemId);

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

    try {
      const result = await getRecommendationAction({
        itemDescription: selectedItem.name,
        itemCondition: selectedItem.condition,
        itemCategory: selectedItem.category,
        returnReason: selectedItem.returnReason,
      });
      updateItem(selectedItem.id, { recommendation: result.recommendedAction, reasoning: result.reasoning });
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

  const sustainabilityMetrics = useMemo(() => {
     const counts = items.reduce((acc, item) => {
         if(item.recommendation) {
             acc[item.recommendation] = (acc[item.recommendation] || 0) + 1;
         }
         return acc;
     }, {} as Record<string, number>);

     return [
        { action: "Resell", value: counts.resell || 0, fill: "var(--color-resell)" },
        { action: "Repair", value: counts.repair || 0, fill: "var(--color-repair)" },
        { action: "Reuse", value: counts.reuse || 0, fill: "var(--color-reuse)" },
        { action: "Recycle", value: counts.recycle || 0, fill: "var(--color-recycle)" },
     ]
  }, [items]);
  
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Returned Items</CardTitle>
                    <CardDescription>
                    Select an item to view details and get an AI-powered action recommendation.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
                        <PlusCircle className="mr-2" />
                        Add Manually
                    </Button>
                    <Button onClick={() => setIsAiChatOpen(true)}>
                        <Bot className="mr-2" />
                        Diagnose with AI
                    </Button>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedItemId || ""} onValueChange={(id) => {setSelectedItemId(id)}}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
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
                       <TableCell className="text-right font-medium">${item.value.toFixed(2)}</TableCell>
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
                <Button onClick={handleGetRecommendation} disabled={isLoading || !!selectedItem.recommendation} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  {selectedItem.recommendation ? 'Recommendation Received' : 'Get Recommendation'}
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

            {selectedItem?.recommendation && (
              <div className="pt-4 border-t">
                <Card className="bg-accent/20">
                  <CardHeader className="items-center text-center">
                    <div className="p-3 bg-background rounded-full">
                        {recommendationIcons[selectedItem.recommendation]}
                    </div>
                    <CardTitle className="capitalize text-2xl text-primary">{selectedItem.recommendation}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">{selectedItem.reasoning}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Add New Returned Item</DialogTitle>
                <DialogDescription>
                    Use the camera to scan the product or manually enter the details below.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                       <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                       {hasCameraPermission === false && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/80">
                            <Camera className="h-10 w-10 text-destructive mb-2"/>
                            <p className="font-semibold">Camera Access Denied</p>
                            <p className="text-sm text-muted-foreground">Please enable camera permissions to use this feature.</p>
                         </div>
                       )}
                       {hasCameraPermission === null && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin"/>
                         </div>
                       )}
                    </div>
                     <Button onClick={handleIdentifyProduct} disabled={!hasCameraPermission || isScanning} className="w-full">
                        {isScanning ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                           <SparklesIcon className="mr-2 h-4 w-4" />
                        )}
                        Scan & Identify with AI
                    </Button>
                </div>
                <div className="space-y-4">
                     <div>
                        <Label htmlFor="item-name">Product Name</Label>
                        <Input id="item-name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                    </div>
                     <div>
                        <Label htmlFor="item-value">Estimated Value ($)</Label>
                        <Input id="item-value" type="number" value={newItem.value} onChange={e => setNewItem({...newItem, value: parseFloat(e.target.value) || 0})} />
                    </div>
                     <div>
                        <Label htmlFor="item-category">Category</Label>
                        <Select value={newItem.category} onValueChange={value => setNewItem({...newItem, category: value as any})}>
                            <SelectTrigger id="item-category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="clothing">Clothing</SelectItem>
                                <SelectItem value="home goods">Home Goods</SelectItem>
                                <SelectItem value="toys">Toys</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="item-condition">Condition</Label>
                         <Select value={newItem.condition} onValueChange={value => setNewItem({...newItem, condition: value as any})}>
                            <SelectTrigger id="item-condition">
                                <SelectValue placeholder="Select a condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="used">Used</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="item-reason">Return Reason</Label>
                        <Textarea id="item-reason" value={newItem.returnReason} onChange={e => setNewItem({...newItem, returnReason: e.target.value})} />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddItem} disabled={!newItem.name}>Add Item</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAiChatOpen} onOpenChange={setIsAiChatOpen}>
        <DialogContent className="sm:max-w-lg">
           <DialogHeader>
                <DialogTitle>Diagnose Item with AI</DialogTitle>
                <DialogDescription>
                    Answer the AI's questions to diagnose the returned item.
                </DialogDescription>
            </DialogHeader>
            <AiDiagnosticChat onComplete={handleAiDiagnoseComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
