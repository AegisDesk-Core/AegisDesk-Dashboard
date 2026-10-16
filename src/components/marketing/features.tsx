import React from "react";
import {
  Bot,
  FileText,
  Sliders,
  ShieldCheck,
  BarChart3,
  Users,
  Languages,
  Activity,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Features() {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Customer Support",
      description:
        "Orchestrated with LangGraph state machines and FastAPI to deliver context-aware, truthful answers without hallucinations.",
      status: "Live & Production Ready",
    },
    {
      icon: FileText,
      title: "PDF & Document Knowledge Bases",
      description:
        "Drag & drop company PDFs, employee handbooks, return policies, and catalogs. Automatically parsed and vector indexed via RAG.",
      status: "Live & Production Ready",
    },
    {
      icon: Sliders,
      title: "Company-Specific AI Customization",
      description:
        "Fine-tune instructions, system tone (concise, friendly, empathetic), fallback messages, and human escalation handoffs.",
      status: "Live & Production Ready",
    },
    {
      icon: ShieldCheck,
      title: "Multi-Tenant Data Isolation",
      description:
        "Strict workspace partition via dedicated Tenant IDs. Your proprietary documents and customer chat logs never cross boundaries.",
      status: "Live & Production Ready",
    },
    {
      icon: BarChart3,
      title: "Conversation History & Analytics",
      description:
        "Search full transcripts, analyze auto-resolution rates, track response latencies, and pinpoint frequently unanswered queries.",
      status: "Live & Production Ready",
    },
    {
      icon: Users,
      title: "Secure Team Access & RBAC",
      description:
        "Role-Based Access Control for Owners, Administrators, and Support Agents. Manage invitations and workspace permissions.",
      status: "Live & Production Ready",
    },
    {
      icon: Languages,
      title: "Multilingual Customer Responses",
      description:
        "Seamlessly comprehend customer queries in 40+ languages and reply using verified information translated in real-time.",
      status: "Live & Production Ready",
    },
    {
      icon: Activity,
      title: "Usage & Entitlement Monitoring",
      description:
        "Real-time consumption meters for monthly conversation quotas, active indexed documents, storage size, and team seats.",
      status: "Live & Production Ready",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 border-t border-border/50 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="indigo" className="mb-3">
            Core Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Enterprise AI Engineered for High-Volume Support
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Everything your company needs to convert static documentation into an accurate, 24/7 AI customer service team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl border border-border bg-card/70 hover:bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {feat.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
