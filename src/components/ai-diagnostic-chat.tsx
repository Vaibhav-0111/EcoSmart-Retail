// src/components/ai-diagnostic-chat.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { diagnoseItemAction } from "@/app/actions";
import { Loader2, Send, Bot, User, CheckCircle } from "lucide-react";
import type { ReturnedItem } from "@/lib/types";

interface ChatMessage {
    role: "user" | "model";
    content: string;
}

interface AiDiagnosticChatProps {
    onComplete: (item: Omit<ReturnedItem, 'id'>) => void;
}

export function AiDiagnosticChat({ onComplete }: AiDiagnosticChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        // Initial message from AI
        const getInitialMessage = async () => {
            try {
                const result = await diagnoseItemAction({ chatHistory: [] });
                setMessages([{ role: "model", content: result.response }]);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Failed to start AI diagnostics.",
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

        const newMessages: ChatMessage[] = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const result = await diagnoseItemAction({ chatHistory: newMessages });
            setMessages(prev => [...prev, { role: "model", content: result.response }]);
            
            if (result.isFinal && result.itemDetails) {
                 setTimeout(() => {
                    onComplete({
                        ...result.itemDetails,
                        recommendation: result.recommendedAction,
                        reasoning: result.reasoning
                    });
                }, 1500); // Wait a bit before closing dialog
            }

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
        <div className="flex flex-col h-[60vh]">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'model' && <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot className="size-5" /></div>}
                            <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm">{message.content}</p>
                            </div>
                            {message.role === 'user' && <div className="p-2 rounded-full bg-muted"><User className="size-5" /></div>}
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
            <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your answer..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}
