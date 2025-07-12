
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { learnPreferencesAction, getSuggestionsAction } from "@/app/actions";
import { Loader2, Sparkles, Bot, User, Wand2, ShoppingBag, Mic, MicOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  role: "user" | "assistant";
  content: string | string[];
}

// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}


export default function AssistantPage() {
  const { toast } = useToast();
  const [browsingHistory, setBrowsingHistory] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState("");
  const [isLearning, setIsLearning] = useState(false);
  const [userPreferences, setUserPreferences] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support for SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setChatInput(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: `Could not recognize speech: ${event.error}`,
          variant: "destructive",
        })
      };

      recognitionRef.current = recognition;
    } else {
        toast({
            title: "Voice Not Supported",
            description: "Your browser does not support voice recognition.",
            variant: "destructive"
        })
    }
  }, [toast]);

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };


  const handleLearnPreferences = async () => {
    if (!browsingHistory && !purchaseHistory) {
      toast({
        title: "Missing Information",
        description: "Please provide either browsing or purchase history.",
        variant: "destructive",
      });
      return;
    }
    setIsLearning(true);
    try {
      const result = await learnPreferencesAction({
        browsingHistory,
        purchaseHistory,
      });
      setUserPreferences(result.userPreferences);
      toast({
        title: "Preferences Learned!",
        description: "Your preferences have been updated based on the provided history.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to learn preferences from the AI.",
        variant: "destructive",
      });
    } finally {
      setIsLearning(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    if (isListening) {
        recognitionRef.current?.stop();
    }

    const newMessages: ChatMessage[] = [
      ...chatMessages,
      { role: "user", content: chatInput },
    ];
    setChatMessages(newMessages);
    setChatInput("");
    setIsReplying(true);

    try {
      const result = await getSuggestionsAction({
        userPreferences,
        query: chatInput,
      });
      setChatMessages([
        ...newMessages,
        { role: "assistant", content: result.suggestions },
      ]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to get suggestions from the AI.",
        variant: "destructive",
      });
       setChatMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I'm having trouble finding suggestions right now." },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Preference Learning</CardTitle>
            <CardDescription>
              Help the AI learn your style by providing your browsing and purchase history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="browsing-history">Browsing History</Label>
              <Textarea
                id="browsing-history"
                placeholder="e.g., 'viewed: running shoes, smart watches, protein powder'"
                value={browsingHistory}
                onChange={(e) => setBrowsingHistory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase-history">Purchase History</Label>
              <Textarea
                id="purchase-history"
                placeholder="e.g., 'bought: yoga mat, water bottle'"
                value={purchaseHistory}
                onChange={(e) => setPurchaseHistory(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button onClick={handleLearnPreferences} disabled={isLearning} className="w-full">
              {isLearning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Learn Preferences
            </Button>
            {userPreferences && (
              <div className="w-full text-sm p-3 bg-accent/20 rounded-lg">
                <p className="font-semibold text-primary">Learned Preferences:</p>
                <p className="text-muted-foreground">{userPreferences}</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="flex flex-col h-[70vh]">
          <CardHeader>
            <CardTitle>AI Shopping Assistant</CardTitle>
            <CardDescription>
              Chat with our AI to find products you'll love.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                   <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <Bot className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Ask me for product recommendations!</p>
                    <p className="text-xs text-muted-foreground">e.g., "Any suggestions for eco-friendly running shoes?"</p>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 ${
                        message.role === "user" ? "justify-end" : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <Avatar>
                           <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                       {typeof message.content === 'string' ? (
                          <p className="text-sm">{message.content}</p>
                        ) : (
                          <div className="space-y-2">
                            <p className="font-semibold">Here are some suggestions for you:</p>
                            <ul className="space-y-2">
                              {message.content.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 p-2 bg-background rounded-md">
                                  <ShoppingBag className="h-4 w-4 text-primary"/>
                                  <span className="text-sm">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                         <Avatar>
                           <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                {isReplying && (
                  <div className="flex items-start gap-4">
                    <Avatar>
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] rounded-lg p-3 bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-4 border-t">
            <form onSubmit={handleChatSubmit} className="flex w-full items-center space-x-2">
              <Input
                id="chat-input"
                placeholder={isListening ? "Listening..." : "Type or speak your message..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isReplying}
              />
              <Button 
                type="button" 
                variant={isListening ? "destructive" : "outline"}
                size="icon" 
                onClick={handleToggleListening}
                disabled={!recognitionRef.current || isReplying}
              >
                  {isListening ? <MicOff /> : <Mic />}
                  <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
              </Button>
              <Button type="submit" disabled={isReplying || !chatInput.trim()}>
                <Sparkles className="mr-2 h-4 w-4" /> Send
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
