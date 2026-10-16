import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Code, Terminal, Layers, CheckCircle2, Shield, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DocsPage() {
  const endpoints = [
    {
      category: "Authentication & Tenants",
      items: [
        { method: "POST", path: "/api/v1/auth/register", desc: "Creates company tenant, initial owner account, and provisions isolated RAG schema." },
        { method: "POST", path: "/api/v1/auth/login", desc: "Authenticates staff member, returns JWT token & tenant membership." },
        { method: "GET", path: "/api/v1/tenant/current", desc: "Returns authorized tenant information for the active session." },
        { method: "PATCH", path: "/api/v1/tenant/settings", desc: "Updates company name, support email, brand color, and default language." },
      ],
    },
    {
      category: "Billing & Subscriptions",
      items: [
        { method: "GET", path: "/api/v1/billing/plans", desc: "Lists all available plans, tiers, and configurable limits." },
        { method: "POST", path: "/api/v1/billing/checkout-session", desc: "Creates Stripe or Razorpay checkout session for plan subscription." },
        { method: "GET", path: "/api/v1/billing/subscription", desc: "Fetches active subscription, renewal date, and real-time usage metrics." },
        { method: "GET", path: "/api/v1/billing/verify-payment", desc: "Verifies checkout session status against payment provider webhooks." },
      ],
    },
    {
      category: "Knowledge Base & Documents",
      items: [
        { method: "GET", path: "/api/v1/documents", desc: "Lists all uploaded PDFs and their processing status (queued, processing, ready, failed)." },
        { method: "POST", path: "/api/v1/documents/upload", desc: "Multipart upload for company PDFs. Triggers LangGraph ingestion graph." },
        { method: "DELETE", path: "/api/v1/documents/{id}", desc: "Deletes document and purges corresponding vector embeddings from PostgreSQL." },
        { method: "POST", path: "/api/v1/documents/{id}/retry", desc: "Retries indexing for documents that encountered a transient parsing error." },
      ],
    },
    {
      category: "AI Assistant Configuration & Chat",
      items: [
        { method: "GET", path: "/api/v1/assistant/config", desc: "Retrieves current assistant configuration (draft or published)." },
        { method: "PUT", path: "/api/v1/assistant/config", desc: "Saves draft assistant settings (system prompt, tone, fallback, topK, score threshold)." },
        { method: "POST", path: "/api/v1/assistant/publish", desc: "Publishes draft settings to live customer widget pipeline." },
        { method: "POST", path: "/api/v1/assistant/test-chat", desc: "Staff preview chat testing responses and inspecting retrieved citations." },
        { method: "POST", path: "/api/v1/widget/{tenantId}/chat", desc: "Customer-facing chat endpoint. Strictly isolated, validates tenant origin." },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="indigo" className="mb-3">
              Developer & Architect Guide
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              FastAPI & LangGraph Backend Contract
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Architecture documentation for connecting this Next.js frontend with your Python FastAPI, LangGraph, and PostgreSQL backend.
            </p>
          </div>

          {/* Architecture overview card */}
          <div className="mb-12 p-8 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Tenant Scoping & Security Headers
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every authenticated request sent from the frontend includes both the <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-primary">Authorization: Bearer &lt;token&gt;</code> header and the <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-primary">X-Tenant-ID: &lt;tenant_id&gt;</code> header.
              The FastAPI backend validates the JWT, checks that the user belongs to the specified tenant, and injects the Tenant ID into the LangGraph state context and database session.
            </p>
          </div>

          {/* Endpoints specification */}
          <div className="space-y-8">
            {endpoints.map((group, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="bg-muted/40 px-6 py-4 border-b border-border">
                  <h3 className="text-base font-bold text-foreground">{group.category}</h3>
                </div>
                <div className="divide-y divide-border">
                  {group.items.map((ep, eIdx) => (
                    <div key={eIdx} className="p-4 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            ep.method === "GET"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                              : ep.method === "POST"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : ep.method === "PATCH" || ep.method === "PUT"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          {ep.method}
                        </span>
                        <code className="font-mono text-foreground font-semibold">{ep.path}</code>
                      </div>
                      <span className="text-muted-foreground max-w-lg">{ep.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
