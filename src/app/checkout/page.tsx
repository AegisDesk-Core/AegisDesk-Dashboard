"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building,
  CreditCard,
  Sparkles,
  Bot,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_PLANS } from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/providers/toast-provider";

const checkoutRegistrationSchema = z
  .object({
    companyName: z.string().min(2, "Company name must be at least 2 characters").max(100),
    fullName: z.string().min(2, "Owner full name is required"),
    email: z.string().email("Please enter a valid company email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
    website: z.string().url("Enter a valid URL (e.g. https://company.com)").optional().or(z.literal("")),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "You must accept the Terms of Service & Privacy Policy" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CheckoutFormData = z.infer<typeof checkoutRegistrationSchema>;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const planParam = searchParams.get("plan") || "professional";
  const intervalParam = (searchParams.get("interval") as "month" | "year") || "month";

  const [selectedPlanId, setSelectedPlanId] = useState<string>(planParam);
  const [billingInterval, setBillingInterval] = useState<"month" | "year">(intervalParam);
  const [paymentProvider, setPaymentProvider] = useState<"stripe" | "razorpay">("stripe");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPlan = MOCK_PLANS.find((p) => p.id === selectedPlanId) || MOCK_PLANS[1];
  const unitPrice = billingInterval === "year" ? selectedPlan.annualPrice : selectedPlan.monthlyPrice;
  const calculatedTotal = unitPrice;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutRegistrationSchema),
    defaultValues: {
      companyName: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      website: "",
      termsAccepted: false as any,
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Step 2: Register company & owner account
      await signUp({
        companyName: data.companyName,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        website: data.website || undefined,
        planId: selectedPlanId,
      });

      // Step 3: Create payment session via FastAPI backend
      const session = await api.createCheckoutSession({
        planId: selectedPlanId,
        billingInterval,
        provider: paymentProvider,
      });

      toast({
        title: "Account Created & Session Initialized",
        description: "Redirecting to payment verification...",
        type: "success",
      });

      // In production, router.push(session.checkoutUrl) redirects to Stripe / Razorpay
      // For demonstration, navigate to the payment confirmation verification flow
      const sessionId = session.sessionId || `sess_${Date.now()}`;
      router.push(`/checkout/success?session_id=${sessionId}&plan=${selectedPlanId}`);
    } catch (err: any) {
      console.error("Checkout submission failed", err);
      setErrorMessage(err.message || "Failed to process registration and checkout session");
      toast({
        title: "Registration Failed",
        description: err.message || "Please check your inputs and try again",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        {/* Top header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight text-foreground text-lg">AegisDesk</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>256-bit Secure TLS Encryption</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Registration Form (Step 2) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Step 2 of 4
                </span>
                <h1 className="text-2xl font-bold text-foreground mt-1">
                  Create Your Company Account
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your company and administrative contact details to provision your isolated tenant workspace.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  id="companyName"
                  label="Company Name *"
                  placeholder="e.g. Acme Retail Corp"
                  error={errors.companyName?.message}
                  {...register("companyName")}
                />

                <Input
                  id="fullName"
                  label="Account Owner Full Name *"
                  placeholder="e.g. Jane Doe"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />

                <Input
                  id="email"
                  type="email"
                  label="Company Work Email *"
                  placeholder="jane@company.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="password"
                    type="password"
                    label="Password *"
                    placeholder="Min. 8 characters"
                    error={errors.password?.message}
                    {...register("password")}
                  />
                  <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password *"
                    placeholder="Repeat password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                </div>

                <Input
                  id="website"
                  type="url"
                  label="Company Website (Optional)"
                  placeholder="https://company.com"
                  error={errors.website?.message}
                  {...register("website")}
                />

                {/* Terms of service checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      {...register("termsAccepted")}
                    />
                    <span className="text-xs text-muted-foreground leading-snug">
                      I accept the{" "}
                      <Link href="/security" target="_blank" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/security" target="_blank" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      . I understand my data is stored in an isolated tenant partition.
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-xs text-destructive mt-1.5">{errors.termsAccepted.message}</p>
                  )}
                </div>

                {/* Payment Provider Selection */}
                <div className="pt-4 border-t border-border/60">
                  <label className="block text-xs font-semibold text-foreground mb-2">
                    Payment Gateway Selection
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentProvider("stripe")}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        paymentProvider === "stripe"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-xs font-bold text-foreground">Stripe</div>
                          <div className="text-[10px] text-muted-foreground">Credit Cards, Apple Pay</div>
                        </div>
                      </div>
                      {paymentProvider === "stripe" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentProvider("razorpay")}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        paymentProvider === "razorpay"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-xs font-bold text-foreground">Razorpay</div>
                          <div className="text-[10px] text-muted-foreground">UPI, Cards, NetBanking</div>
                        </div>
                      </div>
                      {paymentProvider === "razorpay" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Never enter raw card numbers into this application. You will be redirected to the official payment provider checkout session.
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm h-11"
                  >
                    Proceed to Secure Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary (Step 3) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
              <div className="border-b border-border/60 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Order Summary</h3>
                  <Badge variant="indigo">{selectedPlan.name} Plan</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">14-day risk-free trial included</p>
              </div>

              {/* Plan Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Change Selected Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {MOCK_PLANS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        selectedPlanId === p.id
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border text-xs text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="text-xs">{p.name}</div>
                      <div className="text-[11px] font-semibold mt-0.5">
                        ${billingInterval === "year" ? p.annualPrice : p.monthlyPrice}/mo
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan limits highlight */}
              <div className="p-4 rounded-xl bg-muted/40 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Conversations:</span>
                  <span className="font-semibold text-foreground">{selectedPlan.limits.monthlyMessages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Knowledge Base Documents:</span>
                  <span className="font-semibold text-foreground">{selectedPlan.limits.documents} PDFs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team Member Seats:</span>
                  <span className="font-semibold text-foreground">{selectedPlan.limits.teamMembers} Seats</span>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 pt-2 border-t border-border/60 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({billingInterval}ly):</span>
                  <span className="text-foreground font-medium">${calculatedTotal}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applicable Taxes:</span>
                  <span className="text-foreground font-medium">$0.00</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border font-bold text-base text-foreground">
                  <span>Total Payable Today:</span>
                  <span className="text-primary">${calculatedTotal}.00</span>
                </div>
              </div>

              {/* Security guarantees */}
              <div className="p-4 rounded-xl border border-border bg-background/50 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Payments processed through official Stripe / Razorpay gateways.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span>Strict multi-tenant cryptographic isolation guaranteed.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">Loading checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
