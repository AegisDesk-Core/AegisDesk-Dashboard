"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Bot,
  Send,
  MessageSquare,
  X,
  FileText,
  RotateCcw,
  Shield,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { MOCK_TENANT, MOCK_ASSISTANT_CONFIG } from "@/lib/mock-data";

interface ChatMessage {
  id: string;
  sender: "customer" | "assistant";
  content: string;
  citations?: Array<{ documentName: string; chunkSnippet: string; pageNumber?: number }>;
  timestamp: string;
}

export default function CustomerChatWidgetPage() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "tnt_apex_9921";

  const [widgetOpen, setWidgetOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [companyName, setCompanyName] = useState(MOCK_TENANT.name);
  const [brandColor, setBrandColor] = useState(MOCK_TENANT.brandColor);
  const [welcomeMessage, setWelcomeMessage] = useState(MOCK_ASSISTANT_CONFIG.welcomeMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize welcome greeting
    setMessages([
      {
        id: "msg_init",
        sender: "assistant",
        content: welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue("");
    const userMsg: ChatMessage = {
      id: `msg_cust_${Date.now()}`,
      sender: "customer",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({ sender: m.sender, content: m.content }));
      // Customer public chat endpoint
      const res = await api.customerChat(tenantId, userText, history);

      const botMsg: ChatMessage = {
        id: `msg_asst_${Date.now()}`,
        sender: "assistant",
        content: res.reply,
        citations: res.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: "assistant",
        content: "I apologize, but our support assistant encountered a momentary network issue. Please try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/10 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Background container preview context */}
      <div className="w-full max-w-4xl text-center mb-6">
        <Badge variant="indigo" className="mb-2">
          Customer Facing Sandbox View
        </Badge>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {companyName} Customer Support Assistant
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
          This standalone view demonstrates how customers interact with your knowledge base. No internal documents, tokens, or dashboards are exposed.
        </p>
      </div>

      {/* Floating or Embedded Widget Window */}
      <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95">
        {/* Chat Widget Header */}
        <div
          style={{ backgroundColor: brandColor }}
          className="p-4 text-white flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight leading-none">{companyName} Support</h3>
              <div className="text-[10px] text-white/90 flex items-center gap-1.5 mt-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified AI • Answers from Company Docs
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: `msg_reset_${Date.now()}`,
                    sender: "assistant",
                    content: welcomeMessage,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Reset Chat Session"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 space-y-3.5 overflow-y-auto bg-muted/20 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "customer" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  msg.sender === "customer"
                    ? "bg-indigo-600 text-white rounded-br-none shadow-sm"
                    : "bg-card text-foreground border border-border rounded-bl-none shadow-sm"
                }`}
              >
                {msg.content}
              </div>

              {/* Citations block for customer assurance */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-1.5 space-y-1 max-w-[85%]">
                  {msg.citations.map((cite, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded-lg bg-card border border-border/80 text-[10px] text-muted-foreground flex items-center gap-1.5"
                    >
                      <FileText className="h-3 w-3 text-indigo-500 shrink-0" />
                      <span className="truncate">Source: {cite.documentName}</span>
                    </div>
                  ))}
                </div>
              )}

              <span className="text-[9px] text-muted-foreground mt-0.5 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-card border border-border max-w-[120px]">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-3 py-2 bg-card border-t border-border flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => setInputValue("What is your return policy?")}
            className="px-2.5 py-1 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Return Policy
          </button>
          <button
            onClick={() => setInputValue("How long does shipping take?")}
            className="px-2.5 py-1 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Delivery SLA
          </button>
          <button
            onClick={() => setInputValue("Can I speak with a human agent?")}
            className="px-2.5 py-1 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Human Escalation
          </button>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-border bg-card flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            disabled={isTyping}
            className="flex-1 bg-muted/50 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputValue.trim() || isTyping}
            style={{ backgroundColor: brandColor }}
            className="h-9 px-3 text-white rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Powered by footer badge */}
        <div className="py-1.5 bg-muted/40 text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
          <Shield className="h-3 w-3 text-indigo-500" />
          <span>Powered by AegisDesk • Multi-Tenant Protected</span>
        </div>
      </div>
    </div>
  );
}
