"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/lib/validation";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/providers/toast-provider";
import { z } from "zod";

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "alex.morgan@apexretail.io",
      password: "Password123!",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await signIn(data.email, data.password);
      toast({
        title: "Signed In Successfully",
        description: "Redirecting to your isolated company dashboard...",
        type: "success",
      });
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials or unauthorized tenant membership");
      toast({
        title: "Sign In Failed",
        description: err.message || "Please verify your email and password",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl text-foreground">AegisDesk</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Sign In to Company Portal
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Authorized staff and administration access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Pre-fill notice */}
          <div className="mb-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-600 dark:text-indigo-400">
            <strong>Demo Portal Access:</strong> Pre-filled with verified enterprise credentials for instant walkthrough.
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Work Email Address"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary"
                  {...register("rememberMe")}
                />
                Remember this device
              </label>
              <Link href="/auth/forgot-password" className="text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm h-10 mt-2"
            >
              Sign In to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/60 text-center text-xs text-muted-foreground">
            Don't have a company account yet?{" "}
            <Link href="/pricing" className="text-primary hover:underline font-semibold">
              Choose a Plan
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Tenant membership verified by FastAPI JWT backend</span>
        </div>
      </div>
    </div>
  );
}
