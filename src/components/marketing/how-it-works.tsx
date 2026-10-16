import React from "react";
import Link from "next/link";
import {
  CreditCard,
  Building,
  CheckCircle,
  LayoutDashboard,
  UploadCloud,
  Sliders,
  Send,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: CreditCard,
      title: "Choose a Subscription Plan",
      description:
        "Select Starter, Professional, or Enterprise tailored to your monthly customer message volume and document count.",
    },
    {
      step: 2,
      icon: Building,
      title: "Create Your Company Account",
      description:
        "Register your organization name, owner email, and secure credentials to provision a dedicated tenant environment.",
    },
    {
      step: 3,
      icon: CheckCircle,
      title: "Complete Payment Checkout",
      description:
        "Pay securely via Stripe or Razorpay. Frontend validates entitlements strictly after verified backend webhook settlement.",
    },
    {
      step: 4,
      icon: LayoutDashboard,
      title: "Access Your Private Dashboard",
      description:
        "Sign in to your isolated tenant dashboard with your unique Tenant ID and enterprise role-based security access.",
    },
    {
      step: 5,
      icon: UploadCloud,
      title: "Upload Company Documents",
      description:
        "Upload PDFs, return policies, user manuals, and FAQs. Our Python FastAPI pipeline extracts, chunks, and vector-indexes them.",
    },
    {
      step: 6,
      icon: Sliders,
      title: "Customize Your AI Assistant",
      description:
        "Configure personality, tone, welcome greetings, retrieval confidence thresholds, and test in real time before publishing.",
    },
    {
      step: 7,
      icon: Send,
      title: "Publish Customer Chatbot",
      description:
        "Embed our lightweight, customer-isolated chat widget into your website or store with 1 line of script.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Step-by-Step Onboarding
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
            From Company PDF to Live AI Support in Minutes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            A seamless, transparent enterprise journey built for fast implementation and rigorous data isolation.
          </p>
        </div>

        <div className="relative">
          {/* Timeline connecting line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500/20 via-primary to-indigo-500/10 -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-12">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={item.step}
                  className={`flex flex-col lg:flex-row items-center gap-6 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step Card Content */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div
                      className={`w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all ${
                        isEven ? "lg:text-left" : "lg:text-right"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 mb-2 ${
                          isEven ? "justify-start" : "justify-start lg:justify-end"
                        }`}
                      >
                        <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                          Step 0{item.step}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-1.5">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Step Icon Node */}
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Empty Spacer */}
                  <div className="hidden lg:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-16 text-center">
          <Link href="/pricing">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              Start With Step 1: Choose Your Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
