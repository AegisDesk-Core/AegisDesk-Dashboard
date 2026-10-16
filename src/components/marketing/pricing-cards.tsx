"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Shield, ArrowRight, Info } from "lucide-react";
import { MOCK_PLANS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PricingCards() {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");

  return (
    <div className="space-y-12">
      {/* Interval toggle */}
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border">
          <button
            onClick={() => setBillingInterval("month")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              billingInterval === "month"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingInterval("year")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              billingInterval === "year"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              Save 20%
            </span>
          </button>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3.5 w-3.5 text-primary" />
          <span>Transparent pricing with 14-day free trial on all plans. No setup fees.</span>
        </p>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {MOCK_PLANS.map((plan) => {
          const price = billingInterval === "year" ? plan.annualPrice : plan.monthlyPrice;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-8 bg-card flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${
                isPopular
                  ? "border-primary ring-2 ring-primary/20 shadow-xl shadow-indigo-500/10"
                  : "border-border shadow-sm hover:border-border/80"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md px-3 py-1 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  {plan.badge && !isPopular && (
                    <Badge variant="secondary" className="text-[10px]">
                      {plan.badge}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-2 min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-6 pb-6 border-b border-border/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">${price}</span>
                    <span className="text-xs text-muted-foreground">
                      / month {billingInterval === "year" && "(billed annually)"}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Includes {plan.limits.monthlyMessages.toLocaleString()} monthly AI conversations
                  </div>
                </div>

                {/* Limits Snapshot */}
                <div className="mt-6 space-y-2.5">
                  <div className="text-xs font-semibold text-foreground tracking-wide uppercase">
                    Plan Specifications
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="p-2 rounded-lg bg-muted/40">
                      <div className="text-[10px] uppercase font-semibold">Docs Allowed</div>
                      <div className="font-bold text-foreground mt-0.5">{plan.limits.documents} Files</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40">
                      <div className="text-[10px] uppercase font-semibold">Team Seats</div>
                      <div className="font-bold text-foreground mt-0.5">{plan.limits.teamMembers} Members</div>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-3">
                  <div className="text-xs font-semibold text-foreground tracking-wide uppercase">
                    Included Features
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-border/60">
                <Link
                  href={`/checkout?plan=${plan.id}&interval=${billingInterval}`}
                  className="w-full block"
                >
                  <Button
                    className={`w-full font-semibold gap-1.5 ${
                      isPopular
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow hover:opacity-95"
                        : ""
                    }`}
                    variant={isPopular ? "default" : "outline"}
                    size="lg"
                  >
                    Choose {plan.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="text-center mt-2 text-[10px] text-muted-foreground">
                  Safe checkout via backend session
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
