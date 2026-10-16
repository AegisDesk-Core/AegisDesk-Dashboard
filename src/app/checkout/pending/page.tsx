"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, RefreshCw, ArrowRight, ShieldAlert, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function CheckoutPendingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [statusMsg, setStatusMsg] = useState("Awaiting webhook settlement from payment gateway...");

  const handleRefresh = async () => {
    setChecking(true);
    setStatusMsg("Checking backend entitlement status...");
    try {
      const res = await api.verifyPayment("pending_check");
      if (res.verified) {
        router.push("/checkout/success?session_id=verified");
      } else {
        setStatusMsg("Payment is still processing by Stripe/Razorpay. Please refresh in a moment.");
      }
    } catch {
      setStatusMsg("Still pending. We will automatically update your dashboard once settled.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl text-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Clock className="h-8 w-8 animate-pulse" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Pending</h1>
            <p className="text-xs text-muted-foreground mt-2">
              Your payment is being confirmed with the banking network.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 text-xs text-muted-foreground border border-border">
            <p className="font-mono text-[11px] text-foreground">{statusMsg}</p>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Per security policy, access to paid AI features is granted strictly once verified payment events are received.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleRefresh}
              isLoading={checking}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Check Status Now
            </Button>
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full text-xs">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
