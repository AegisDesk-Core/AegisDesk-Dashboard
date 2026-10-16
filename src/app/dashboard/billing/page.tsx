"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowUpRight,
  ShieldAlert,
  Download,
  Calendar,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/providers/toast-provider";
import { SubscriptionInfo } from "@/types";
import { formatDate, formatBytes } from "@/lib/utils";

export default function BillingPage() {
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    async function loadBilling() {
      try {
        const sub = await api.getSubscription();
        setSubscription(sub);
      } catch (err) {
        console.error("Failed to load subscription info", err);
      } finally {
        setLoading(false);
      }
    }
    loadBilling();
  }, []);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      // Simulate backend cancellation call
      await new Promise((r) => setTimeout(r, 600));
      if (subscription) {
        setSubscription({ ...subscription, cancelAtPeriodEnd: true });
      }
      setCancelModalOpen(false);
      toast({
        title: "Cancellation Scheduled",
        description: "Your plan will remain active until the end of the current billing cycle.",
        type: "info",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Subscription & Billing
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your company subscription plan, entitlement limits, and invoice history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/pricing">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Current Subscription Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{subscription?.planName || "Professional Plan"}</CardTitle>
                    <Badge variant="success" className="capitalize">
                      {subscription?.status || "Active"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    Billed {subscription?.billingInterval}ly • Next automatic renewal on{" "}
                    {subscription ? formatDate(subscription.currentPeriodEnd) : "Nov 1, 2024"}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    ${subscription?.billingInterval === "year" ? "119" : "149"}
                    <span className="text-xs text-muted-foreground font-normal"> / month</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {/* Usage Progress Gauges */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Current Consumption & Entitlements
                </h4>

                {/* Messages gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Monthly Conversations</span>
                    <span className="font-semibold text-foreground font-mono">
                      {subscription?.usage.messagesUsed.toLocaleString()} / {subscription?.usage.messagesLimit.toLocaleString()} (32%)
                    </span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>

                {/* Documents gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Knowledge Base Documents</span>
                    <span className="font-semibold text-foreground font-mono">
                      {subscription?.usage.documentsCount} / {subscription?.usage.documentsLimit} PDFs (5%)
                    </span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>

                {/* Team members */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Team Member Seats</span>
                    <span className="font-semibold text-foreground font-mono">
                      {subscription?.usage.teamSeatsUsed} / {subscription?.usage.teamSeatsLimit} Seats (40%)
                    </span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </div>

              {/* Actions row */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                {subscription?.cancelAtPeriodEnd ? (
                  <div className="text-amber-500 font-medium">
                    Scheduled to cancel at end of current billing period.
                  </div>
                ) : (
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="text-muted-foreground hover:text-destructive hover:underline text-xs"
                  >
                    Cancel Subscription
                  </button>
                )}

                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="text-xs">
                    Change Plan Tier
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method & Security Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Payment Method</CardTitle>
              <CardDescription className="text-xs">Secure gateway integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/30 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-indigo-500 shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Stripe Direct Billing</div>
                  <div className="text-[10px] text-muted-foreground">•••• 4242 (Expires 12/28)</div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Raw credit card details are never stored on this application server. Card verification is handled via encrypted Stripe tokens.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoices and Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoices & Payment History</CardTitle>
          <CardDescription className="text-xs">
            Past subscription receipts and verified payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground border-y border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold">Invoice Number</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subscription?.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-foreground">{inv.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(inv.date)}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      ${inv.amount}.00 USD
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success" className="capitalize text-[10px]">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
                        <Download className="h-3 w-3" />
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Subscription Confirmation"
        description="Are you sure you want to cancel your AI support subscription?"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive leading-relaxed">
            Upon cancellation at the end of the billing cycle, AI chatbot responses will pause and document uploads will be restricted.
          </div>
          <p className="text-muted-foreground">
            You will retain access until <strong>{subscription ? formatDate(subscription.currentPeriodEnd) : "Nov 1, 2024"}</strong>.
          </p>
          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCancelModalOpen(false)}>
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              size="sm"
              isLoading={isCancelling}
              onClick={handleCancelSubscription}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
