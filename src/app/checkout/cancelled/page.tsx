import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl text-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <XCircle className="h-8 w-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Checkout Cancelled</h1>
            <p className="text-xs text-muted-foreground mt-2">
              The payment process was cancelled before completion. No charges were made to your account.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground">
            You can select a different subscription plan or retry with another payment method anytime.
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/pricing">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <RefreshCw className="h-4 w-4" />
                Select Another Plan
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full text-xs gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Landing Page
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
