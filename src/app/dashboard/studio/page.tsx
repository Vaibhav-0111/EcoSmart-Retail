// src/app/dashboard/studio/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateProductImageAction } from "@/app/actions";
import { Loader2, Wand2, Image as ImageIcon, Download } from "lucide-react";
import Image from "next/image";

export default function ProductStudioPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("A sleek, modern black coffee maker with stainless steel accents, with a cup of coffee next to it.");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
        toast({
            title: "Prompt is empty",
            description: "Please enter a description for the product you want to visualize.",
            variant: "destructive",
        });
        return;
    }
    
    setIsLoading(true);
    setGeneratedImage(null);

    try {
        const result = await generateProductImageAction({ prompt });
        setGeneratedImage(result.dataUri);
        toast({
            title: "Image Generated!",
            description: "Your product visualization is ready.",
        });
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to generate the image. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "product-visualization.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Product Studio</h1>
            <p className="text-muted-foreground">
                Visualize product concepts and create marketing assets instantly with AI.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Image Prompt</CardTitle>
                    <CardDescription>
                        Describe the product you want to see. Be as detailed as possible for the best results.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A pair of red running shoes with white soles, studio lighting..."
                        rows={6}
                        disabled={isLoading}
                    />
                    <Button onClick={handleGenerateImage} disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        Generate Image
                    </Button>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                 <CardHeader>
                    <CardTitle>Generated Image</CardTitle>
                    <CardDescription>
                        The AI-generated visualization of your product will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center text-center">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                <p className="mt-4 text-muted-foreground">AI is creating your image... (this may take a moment)</p>
                            </div>
                        )}
                        {!isLoading && !generatedImage && (
                            <div className="flex flex-col items-center justify-center text-center">
                                <ImageIcon className="size-16 text-muted-foreground"/>
                                <p className="mt-4 font-semibold">Image will appear here</p>
                                <p className="text-sm text-muted-foreground">Enter a prompt and click "Generate Image".</p>
                            </div>
                        )}
                        {generatedImage && (
                           <>
                             <Image
                                src={generatedImage}
                                alt="AI-generated product image"
                                layout="fill"
                                objectFit="contain"
                                className="transition-opacity duration-500 opacity-100"
                            />
                            <Button
                                size="icon"
                                className="absolute bottom-4 right-4"
                                onClick={handleDownload}
                            >
                                <Download className="size-4" />
                                <span className="sr-only">Download Image</span>
                            </Button>
                           </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
