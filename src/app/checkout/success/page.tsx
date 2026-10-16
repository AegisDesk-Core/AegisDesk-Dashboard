"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Copy,
  AlertTriangle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/providers/toast-provider";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "demo_session";
  const { tenant, user, refreshTenant } = useAuth();
  const { toast } = useToast();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkPaymentStatus() {
      try {
        // Enforce requirement: A successful redirect alone must not grant access.
        // The frontend must verify against the backend entitlement system.
        const res = await api.verifyPayment(sessionId);
        if (isMounted) {
          if (res.verified) {
            setIsVerified(true);
            await refreshTenant();
            toast({
              title: "Payment Verified by Backend",
              description: "Your tenant environment is active and ready.",
              type: "success",
            });
          } else {
            setIsVerified(false);
            setVerificationError("Payment is currently awaiting webhook settlement.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setIsVerified(false);
          setVerificationError(err.message || "Failed to verify payment with backend");
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    checkPaymentStatus();

    return () => {
      isMounted = false;
    };
  }, [sessionId, refreshTenant, toast]);

  const copyTenantId = () => {
    if (tenant?.id) {
      navigator.clipboard.writeText(tenant.id);
      setCopied(true);
      toast({
        title: "Tenant ID Copied",
        description: "Your unique workspace identifier is copied to clipboard.",
        type: "info",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl text-center space-y-6">
          {isVerifying ? (
            <div className="py-12 space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <h2 className="text-xl font-bold text-foreground">
                Verifying Payment & Provisioning Tenant...
              </h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Contacting backend verification service to ensure trusted webhook confirmation before granting access.
              </p>
            </div>
          ) : isVerified ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <Badge variant="success" className="mb-2">
                  Payment Verified • Entitlement Active
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Welcome to AegisDesk!
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Your isolated tenant environment and AI pipeline are initialized.
                </p>
              </div>

              {/* Tenant Credentials Box */}
              <div className="p-4 rounded-xl border border-border bg-muted/30 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-primary" />
                    {tenant?.name || "Your Company Workspace"}
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {tenant?.subscriptionPlan || "Professional"} Plan
                  </Badge>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <div className="text-[11px] font-medium text-muted-foreground mb-1">
                    Your Assigned Tenant ID:
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border font-mono text-xs">
                    <span className="text-primary font-bold">{tenant?.id || "tnt_apex_9921"}</span>
                    <button
                      onClick={copyTenantId}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  "The Tenant ID identifies your company's workspace. It is not a password, API key, or proof of authorization."
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2">
                    Access Company Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/knowledge-base">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Jump Directly to Upload PDFs
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Payment Verification Pending</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {verificationError || "We are awaiting confirmation from your payment provider. This usually completes in under a minute."}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/checkout/pending">
                  <Button variant="outline">View Pending Status</Button>
                </Link>
                <Link href="/checkout">
                  <Button>Retry Checkout</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">Verifying payment status...</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
