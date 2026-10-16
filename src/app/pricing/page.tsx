import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { HelpCircle, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const faqs = [
    {
      q: "How does the 14-day trial work?",
      a: "You can create an account, upload up to 20 documents, customize your AI assistant, and test customer inquiries with full features for 14 days without charge.",
    },
    {
      q: "Can I upgrade or downgrade my plan later?",
      a: "Yes. You can switch plans anytime from your company billing settings. Pro-rated credits are automatically calculated and applied to your next billing cycle.",
    },
    {
      q: "How is my company's data kept isolated from other businesses?",
      a: "Every tenant is provisioned with a unique, cryptographically distinct Tenant ID. Vector embeddings and document metadata are queried strictly within tenant-scoped partitions in PostgreSQL.",
    },
    {
      q: "What file formats can I upload to my knowledge base?",
      a: "We currently support PDF files (standard text, scans with OCR, manuals, product catalogs, and policies). Support for DOCX, CSV, and Notion/Zendesk sync is in active rollout.",
    },
    {
      q: "What happens if I exceed my monthly conversation limit?",
      a: "We will never abruptly cut off your active customers. You will receive an email alert at 80% and 100% capacity, with the option to enable automatic burst overage or upgrade instantly.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Subscription Plans
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mt-2">
              Predictable Pricing for High-Growth Support Teams
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Select the right capacity for your support volume. Every subscription includes our full multi-tenant RAG architecture and customization dashboard.
            </p>
          </div>

          {/* Pricing cards */}
          <PricingCards />

          {/* Enterprise custom banner */}
          <div className="mt-16 rounded-2xl border border-border bg-card p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Need Dedicated On-Premise or Custom SLA?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                We provide custom VPC deployments, dedicated PostgreSQL vector databases, HIPAA/SOC2 Type II compliance audits, and custom model fine-tuning.
              </p>
            </div>
            <Link href="/checkout?plan=enterprise&interval=year">
              <Button size="lg" className="shrink-0 bg-primary text-primary-foreground">
                Inquire Enterprise Setup
              </Button>
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Have questions about billing, integrations, or security? We've got you covered.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-card">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-2 pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
