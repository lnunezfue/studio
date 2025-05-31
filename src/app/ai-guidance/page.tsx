"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { medicalGuidanceChat, MedicalGuidanceChatInput, MedicalGuidanceChatOutput } from "@/ai/flows/medical-guidance-chat";
import type { ChatMessage } from "@/types";
import { Bot, SendHorizonal, User, Sparkles } from "lucide-react";
import React, { useState, useRef, useEffect, FormEvent } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AiGuidancePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatInput: MedicalGuidanceChatInput = {
        userInput: userMessage.content,
        pastMessages: messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      };
      const result: MedicalGuidanceChatOutput = await medicalGuidanceChat(chatInput);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI chat flow:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="AI Medical Guidance"
        description="Get preliminary health information from our AI assistant. This is not a substitute for professional medical advice."
      />
      <Card className="shadow-xl h-[calc(100vh-200px)] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="w-6 h-6 text-primary" /> AI Health Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot size={48} className="mb-4" />
                <p className="text-lg">Welcome to AI Medical Guidance!</p>
                <p>Ask me about symptoms, health conditions, or general wellness.</p>
                <p className="text-xs mt-2">(e.g., "What are common flu symptoms?", "How can I improve my sleep?")</p>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <Avatar className="w-8 h-8 border border-primary">
                      <AvatarFallback><Bot size={18} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-xl px-4 py-3 text-sm shadow",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    )}
                  >
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                     <p className={cn(
                        "text-xs mt-1",
                        msg.role === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
                      )}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                  </div>
                  {msg.role === "user" && (
                     <Avatar className="w-8 h-8">
                       <AvatarFallback><User size={18} /></AvatarFallback>
                     </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="w-8 h-8 border border-primary">
                     <AvatarFallback><Bot size={18} /></AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] rounded-xl px-4 py-3 text-sm shadow bg-card border">
                    <div className="flex items-center space-x-1">
                      <span className="animate-pulse">●</span>
                      <span className="animate-pulse delay-100">●</span>
                      <span className="animate-pulse delay-200">●</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <SendHorizonal className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </MainLayout>
  );
}
