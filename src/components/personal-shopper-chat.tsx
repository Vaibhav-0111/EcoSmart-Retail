// src/components/personal-shopper-chat.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { personalShopperAction } from "@/app/actions";
import { Loader2, Send, Bot, User, Sparkles, Mic, MicOff } from "lucide-react";

// SpeechRecognition type might not be available on the window object, so we declare it.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

interface ChatMessage {
    role: "user" | "model" | "tool";
    content: string;
    recommendedProducts?: Product[];
}

export function PersonalShopperChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const { toast } = useToast();
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.lang = 'en-US';
          recognitionRef.current.interimResults = false;
    
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            toast({ title: "Message captured!", description: "Your voice message is ready to send." });
          };
    
          recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
             if (event.error !== 'no-speech') {
                toast({ title: "Voice Error", description: "Could not recognize speech.", variant: "destructive" });
             }
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
          try {
            recognitionRef.current?.start();
            setIsListening(true);
          } catch (error) {
            console.error("Could not start recognition:", error)
            toast({ title: "Voice Error", description: "Could not start voice recognition. Please try again.", variant: "destructive" });
            setIsListening(false);
          }
        }
    };

    useEffect(() => {
        // Initial message from AI
        const getInitialMessage = async () => {
            try {
                const result = await personalShopperAction({ chatHistory: [] });
                setMessages([{ role: "model", content: result.response }]);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Failed to start AI shopper.",
                    variant: "destructive",
                });
                setMessages([{ role: "model", content: "Sorry, I'm having trouble starting. Please try again later." }]);
            } finally {
                setIsLoading(false);
            }
        };
        getInitialMessage();
    }, [toast]);
    
    useEffect(() => {
        // Scroll to bottom when new messages are added
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: "user", content: input };
        const newMessages: ChatMessage[] = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const result = await personalShopperAction({ chatHistory: newMessages });
            setMessages(prev => [...prev, { role: "model", content: result.response, recommendedProducts: result.recommendedProducts }]);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "The AI failed to respond.",
                variant: "destructive",
            });
            setMessages(prev => [...prev, { role: "model", content: "I'm having some trouble. Please try again." }])
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
                <div className="space-y-6">
                    {messages.map((message, index) => (
                        <div key={index}>
                            <div className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'model' && 
                                  <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot className="size-5" /></div>
                                }
                                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm">{message.content}</p>
                                </div>
                                {message.role === 'user' && <div className="p-2 rounded-full bg-muted"><User className="size-5" /></div>}
                            </div>
                            {message.recommendedProducts && message.recommendedProducts.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 ml-12">
                                    {message.recommendedProducts.map(product => (
                                        <Card key={product.id}>
                                            <CardHeader className="p-0">
                                                <div className="aspect-video relative w-full">
                                                    <Image src={product.imageUrl} alt={product.name} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint="product photo" />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 space-y-2">
                                                <CardTitle className="text-base">{product.name}</CardTitle>
                                                <CardDescription className="text-xs">{product.description}</CardDescription>
                                            </CardContent>
                                            <CardFooter className="p-4 flex justify-between items-center">
                                                <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                                                <Button size="sm">View</Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && (
                         <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot className="size-5" /></div>
                            <div className="rounded-lg px-4 py-2 bg-muted">
                               <Loader2 className="size-5 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe what you're looking for..."
                        disabled={isLoading}
                    />
                     <Button
                        type="button"
                        variant={isListening ? "destructive" : "outline"}
                        size="icon"
                        onClick={handleToggleListening}
                        disabled={isLoading}
                        title={isListening ? "Stop listening" : "Use voice"}
                    >
                       {isListening ? <MicOff /> : <Mic />}
                    </Button>
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="size-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
                 <p className="text-xs text-muted-foreground mt-2 text-center">
                    <Sparkles className="size-3 inline-block mr-1" />
                    Our AI Personal Shopper can help you find the perfect product. Try "a gift for my dad" or "something for hiking".
                </p>
            </div>
        </div>
    );
}
