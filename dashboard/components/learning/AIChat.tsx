"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { AIChatMessage } from "@/lib/learning/types";

interface AIChatProps {
  taskTitle: string;
  taskContext: string;
  currentStep?: string;
}

export default function AIChat({ taskTitle, taskContext, currentStep }: AIChatProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: AIChatMessage = {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm here to help you complete "${taskTitle}". ${taskContext} Feel free to ask me any questions about the task or the current step!`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [taskTitle, taskContext]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call AI API endpoint
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          taskTitle,
          taskContext,
          currentStep,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      const assistantMessage: AIChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling AI:", error);
      const errorMessage: AIChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a1a] border border-white/20 rounded-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot className="text-[#00d4ff]" size={20} />
          <h3 className="text-white font-semibold">AI Assistant</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-[#00d4ff]" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-[#00d4ff] text-white"
                  : "bg-[#0f0f23] text-white/90 border border-white/10"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-[#00d4ff]" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
              <Bot size={16} className="text-[#00d4ff]" />
            </div>
            <div className="bg-[#0f0f23] border border-white/10 rounded-lg p-3">
              <Loader2 className="animate-spin text-[#00d4ff]" size={16} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-[#0f0f23] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#00d4ff]/50"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-[#00d4ff] text-white rounded-lg hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

