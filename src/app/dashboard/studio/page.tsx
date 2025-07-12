// src/app/dashboard/studio/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateProductImageAction, describeImageAction, textToSpeechAction } from "@/app/actions";
import { Loader2, Wand2, Image as ImageIcon, Download, Mic, MicOff, Volume2 } from "lucide-react";
import Image from "next/image";

// SpeechRecognition type might not be available on the window object, so we declare it.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ProductStudioPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("A sleek, modern black coffee maker with stainless steel accents, with a cup of coffee next to it.");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
        toast({ title: "Prompt captured!", description: "Voice prompt has been filled." });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          toast({ title: "Voice Error", description: "Could not recognize speech.", variant: "destructive" });
        }
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
         setIsListening(false);
      }
    }
  }, [toast]);

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        toast({ title: "Unsupported", description: "Voice recognition is not supported in your browser.", variant: "destructive" });
        return;
      }
      // Prevent starting if already active
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error("Could not start recognition:", error)
        // This might happen if it's already started, so we'll just ensure state is correct
        setIsListening(false);
      }
    }
  };

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
    if(audio) audio.pause();

    try {
      const result = await generateProductImageAction({ prompt });
      setGeneratedImage(result.dataUri);
      toast({
        title: "Image Generated!",
        description: "Your product visualization is ready.",
      });

      // Now, describe the image and generate audio
      const descriptionResult = await describeImageAction({ photoDataUri: result.dataUri });
      const audioResult = await textToSpeechAction({ text: descriptionResult.description });

      const newAudio = new Audio(audioResult.audioDataUri);
      setAudio(newAudio);

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate the image or audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (audio) {
      setIsSpeaking(true);
      audio.play();
      audio.onended = () => setIsSpeaking(false);
    }
  }
  
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
                    <div className="flex gap-2">
                         <Button onClick={handleGenerateImage} disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Wand2 className="mr-2 h-4 w-4" />
                            )}
                            Generate Image
                        </Button>
                        <Button
                            variant={isListening ? "destructive" : "outline"}
                            size="icon"
                            onClick={handleToggleListening}
                            disabled={isLoading}
                            title={isListening ? "Stop listening" : "Use voice prompt"}
                        >
                           {isListening ? <MicOff /> : <Mic />}
                        </Button>
                    </div>
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
                                data-ai-hint="product photo"
                            />
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <Button
                                    size="icon"
                                    onClick={handlePlayAudio}
                                    disabled={!audio || isSpeaking || isLoading}
                                >
                                    <Volume2 className="size-4" />
                                    <span className="sr-only">Play Description</span>
                                </Button>
                                <Button
                                    size="icon"
                                    onClick={handleDownload}
                                >
                                    <Download className="size-4" />
                                    <span className="sr-only">Download Image</span>
                                </Button>
                            </div>
                           </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
