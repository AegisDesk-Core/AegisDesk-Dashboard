import Link from "next/link";
import { Bot, Shield, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <span className="font-bold tracking-tight text-foreground">AegisDesk</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise multi-tenant AI customer support platform. Powered by LangGraph, high-precision RAG vector search, and strict workspace isolation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Multi-Tenant Data Isolated</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Subscription Plans</Link></li>
              <li><Link href="/widget/tnt_apex_9921" className="hover:text-foreground">Customer Chat Widget</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Staff Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Trust & Security</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/security" className="hover:text-foreground">Security Architecture</Link></li>
              <li><Link href="/security#isolation" className="hover:text-foreground">Tenant Isolation Policy</Link></li>
              <li><Link href="/security#rag" className="hover:text-foreground">RAG Guardrails</Link></li>
              <li><Link href="/security#compliance" className="hover:text-foreground">SOC2 & GDPR Alignment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
              <li><Link href="/docs#fastapi" className="hover:text-foreground">FastAPI Backend Contract</Link></li>
              <li><Link href="/auth/sign-in" className="hover:text-foreground">Company Portal Login</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Start 14-Day Trial</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} AegisDesk Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/security" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/security" className="hover:text-foreground">Terms of Service</Link>
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-indigo-500" />
              <span>TLS 1.3 & AES-256 Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
