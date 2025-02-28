import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types for our chat messages
export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

export interface AIChatWindowProps {
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string) => Promise<void>;
  className?: string;
}

export function AIChatWindow({
  initialMessages = [],
  onSendMessage,
  className,
}: AIChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // This is where we'll integrate the WebSocket API later
      if (onSendMessage) {
        await onSendMessage(newMessage.content);
      }

      // Simulate AI response (remove this when implementing real API)
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "This is a placeholder response. Replace with actual AI response.",
          timestamp: new Date(),
          status: "sent",
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "error" } : msg
        )
      );
      setIsTyping(false);
    }
  };

  // Handle textarea height adjustment
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  return (
    <div className="w-80 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col h-full">
      {/* Header with gradient background */}
      <div className="p-4 border-b border-border bg-foreground/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            <h2 className="font-semibold">AI Assistant</h2>
          </div>
          <button className="rounded-full size-6 inline-flex items-center justify-center hover:bg-muted transition-colors">
            ×
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className={cn("flex flex-col h-full", className)}>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col",
                    message.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 shadow-sm",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                        : "bg-muted/50 border border-border/50"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.status === "error" && (
                    <span className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <svg
                        className="size-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Failed to send
                    </span>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-2 rounded-full bg-primary/40"
                        style={{
                          animation: "bounce 1.4s infinite",
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium">AI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  placeholder="Message AI Assistant..."
                  className="min-h-[40px] max-h-[200px] resize-none rounded-xl bg-muted/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                  className="rounded-xl shrink-0"
                >
                  <svg
                    className="size-4 rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
