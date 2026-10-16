"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Bot,
  Layers,
  CheckCircle2,
  Lock,
  MessageSquare,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const [activePreviewTab, setActivePreviewTab] = useState<"dashboard" | "widget">("dashboard");

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-500/15 via-violet-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top announcement pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Multi-Tenant Architecture • Python FastAPI + LangGraph Backend</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span className="font-semibold">v2.4 Released</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          AI Customer Support,{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Powered by Your Company Knowledge.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Turn your company documents into an intelligent AI assistant. Upload your knowledge base, customize your assistant, and automate customer support from one dashboard.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/pricing">
            <Button size="lg" className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] transition-all">
              Explore Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#interactive-preview">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-border hover:bg-muted/60">
              View Product Demo
            </Button>
          </a>
        </div>

        {/* Key trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Isolated Tenant Vector Spaces</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-indigo-500" />
            <span>Role-Based Permissions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-violet-500" />
            <span>Zero Data Leakage Across Tenants</span>
          </div>
        </div>

        {/* Interactive Live Product Preview Container */}
        <div id="interactive-preview" className="mt-16 text-left max-w-5xl mx-auto rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Header Bar of the preview */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-muted-foreground hidden sm:inline">
                https://app.aegisdesk.ai/{activePreviewTab === "dashboard" ? "dashboard" : "widget/preview"}
              </span>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-background/80 border border-border">
              <button
                onClick={() => setActivePreviewTab("dashboard")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activePreviewTab === "dashboard"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Company Dashboard
              </button>
              <button
                onClick={() => setActivePreviewTab("widget")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activePreviewTab === "widget"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                Customer Chat Widget
              </button>
            </div>
          </div>

          {/* Interactive Preview Body */}
          <div className="p-4 sm:p-6 bg-background/40 min-h-[420px]">
            {activePreviewTab === "dashboard" ? (
              /* Simulated Company Dashboard */
              <div className="space-y-6">
                {/* Dashboard top row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">Apex Retail Hub</h3>
                      <Badge variant="success">Active Plan: Professional</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      Tenant ID: <span className="text-primary font-semibold">tnt_apex_9921</span> • Isolated Vector Store
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                      <Button size="sm" variant="outline" className="text-xs gap-1">
                        Open Full Dashboard
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* KPI metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl border border-border bg-card/70">
                    <div className="text-[11px] font-medium text-muted-foreground">Monthly Conversations</div>
                    <div className="text-2xl font-bold text-foreground mt-1">1,248</div>
                    <div className="text-[11px] text-emerald-500 mt-0.5 font-medium">↑ 18.4% from last month</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-border bg-card/70">
                    <div className="text-[11px] font-medium text-muted-foreground">Documents Ingested</div>
                    <div className="text-2xl font-bold text-foreground mt-1">5 PDFs</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">216 indexed chunks</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-border bg-card/70">
                    <div className="text-[11px] font-medium text-muted-foreground">AI Resolution Rate</div>
                    <div className="text-2xl font-bold text-foreground mt-1">91.5%</div>
                    <div className="text-[11px] text-emerald-500 mt-0.5 font-medium">↑ 4.8% auto-resolved</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-border bg-card/70">
                    <div className="text-[11px] font-medium text-muted-foreground">Avg Latency</div>
                    <div className="text-2xl font-bold text-foreground mt-1">840 ms</div>
                    <div className="text-[11px] text-emerald-500 mt-0.5 font-medium">FastAPI + LangGraph RAG</div>
                  </div>
                </div>

                {/* Bottom preview split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        Active Ingested Documents
                      </span>
                      <span className="text-[10px] text-muted-foreground">Ready for RAG</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                        <span className="truncate max-w-[200px] font-medium">Customer_Return_Policy_2024.pdf</span>
                        <Badge variant="success" className="text-[10px]">Ready (38 chunks)</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                        <span className="truncate max-w-[200px] font-medium">Shipping_Delivery_Timelines.pdf</span>
                        <Badge variant="success" className="text-[10px]">Ready (24 chunks)</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                        <span className="truncate max-w-[200px] font-medium">Warranty_Repairs_Q4.pdf</span>
                        <Badge variant="warning" className="text-[10px]">Processing</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-card/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-primary" />
                        Live Customer Queries
                      </span>
                      <span className="text-[10px] text-emerald-500">Auto-Resolved</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 rounded-lg bg-muted/30">
                        <div className="font-medium text-foreground">"Can I return opened electronics within 30 days?"</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Answered with citation from Return Policy (94% match)</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/30">
                        <div className="font-medium text-foreground">"How long does Canadian express delivery take?"</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Answered with citation from Shipping Guide (91% match)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Simulated Customer-Facing Chat Widget */
              <div className="max-w-md mx-auto rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
                <div className="p-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none">Apex Concierge AI</div>
                      <div className="text-[10px] text-white/80 mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Official Support • Online
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/90">
                    Customer View
                  </span>
                </div>

                <div className="p-4 space-y-3 bg-muted/10 min-h-[260px] text-xs">
                  {/* Assistant greeting */}
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="p-2.5 rounded-xl rounded-tl-none bg-muted/60 text-foreground max-w-[85%]">
                      Hello! Welcome to Apex Retail Hub. How can I assist you with orders, returns, or product details today?
                    </div>
                  </div>

                  {/* Customer query */}
                  <div className="flex items-start justify-end gap-2">
                    <div className="p-2.5 rounded-xl rounded-tr-none bg-primary text-primary-foreground max-w-[85%]">
                      Can I return opened headphones if I received them 12 days ago?
                    </div>
                  </div>

                  {/* Assistant response with citation */}
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="p-2.5 rounded-xl rounded-tl-none bg-muted/60 text-foreground max-w-[85%] space-y-2">
                      <p>
                        Yes! According to our Customer Return and Refund Policy, opened electronics can be returned within 30 days of delivery as long as all accessories are included.
                      </p>
                      <div className="p-1.5 rounded bg-background/80 border border-border text-[10px] text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3 text-indigo-500" />
                        <span>Source: Customer_Return_and_Refund_Policy_2024.pdf (p. 3)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-border bg-card flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    placeholder="Type your question..."
                    className="flex-1 bg-muted/50 rounded-lg px-3 py-1.5 text-xs text-muted-foreground border-0"
                  />
                  <Button size="sm" className="h-7 text-xs bg-indigo-600 text-white">
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
