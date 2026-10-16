import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Shield, Lock, Database, FileCheck, Key, Server, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SecurityPage() {
  const securityPillars = [
    {
      icon: Database,
      title: "Multi-Tenant Data Isolation",
      desc: "Every database query and vector similarity calculation enforces strict workspace scoping using the verified Tenant ID. Row-Level Security (RLS) in PostgreSQL prevents any tenant from viewing another organization's records.",
    },
    {
      icon: Lock,
      title: "RAG Retrieval Guardrails",
      desc: "Our LangGraph state graph validates customer query intent, bounds retrieval chunks strictly to verified documents belonging to the authenticated tenant, and strips prompt injection attempts.",
    },
    {
      icon: Key,
      title: "No Raw Token Or Secret Exposure",
      desc: "The customer chat widget communicates through securely scoped public endpoints. Internal administrative credentials, company documents, and private API keys are never leaked to end customers.",
    },
    {
      icon: Server,
      title: "Encryption In Transit & At Rest",
      desc: "All data exchanges are guarded by TLS 1.3 with HSTS enabled. Document files and PostgreSQL vector storage partitions are encrypted using AES-256.",
    },
    {
      icon: FileCheck,
      title: "No Foundation Model Training",
      desc: "Your proprietary documents, policies, employee handbooks, and customer conversations are never utilized to pre-train or fine-tune public baseline AI models.",
    },
    {
      icon: Shield,
      title: "Role-Based Access Control (RBAC)",
      desc: "Granular roles for Owners, Admins, and Support Agents. Billing operations and team modifications require authenticated owner privileges verified on the FastAPI backend.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="indigo" className="mb-3">
              Trust & Architecture
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Security & Multi-Tenant Data Isolation
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              How AegisDesk protects your company knowledge base, vector embeddings, and customer conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {securityPillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-border bg-card/60">
            <h3 className="text-lg font-bold text-foreground mb-4">Tenant ID Policy Notice</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              "The Tenant ID identifies your company's workspace. It is not a password, API key, or proof of authorization."
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The frontend never trusts a user-supplied Tenant ID alone. Every API call requires a cryptographic session token verified by the Python FastAPI backend, which independently enforces tenant membership and user roles before returning data.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
