import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingCards } from "@/components/marketing/pricing-cards";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-indigo-500/20">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />

        {/* Pricing Section on Landing Page */}
        <section id="pricing" className="py-20 md:py-28 border-t border-border/50 bg-muted/20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Flexible & Predictable
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
                Simple Plans Tailored to Your Support Load
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                All plans include multi-tenant isolation, PDF ingestion, and LangGraph RAG orchestration.
              </p>
            </div>

            <PricingCards />
          </div>
        </section>

        {/* Security & Tenant Isolation Callout */}
        <section className="py-16 border-t border-border/50 bg-card/60">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-background to-violet-950/30 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Enterprise Security Standard</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Your Company Knowledge Stays Exclusively Yours
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every company receives an isolated Tenant ID partition in PostgreSQL and vector storage.
                  Customer chat sessions are strictly sandboxed and never leak proprietary data across organizations.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Dedicated Tenant Schemas
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Encrypted at Rest & in Transit
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    No Model Training on Tenant Data
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Link href="/security">
                  <Button variant="outline" className="h-11 px-6">
                    Review Security Specs
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                    Get Started Today
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
