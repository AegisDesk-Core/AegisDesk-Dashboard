"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/validation";
import { z } from "zod";

type ForgotFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsSubmitting(true);
    // Simulate sending recovery email
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setIsSent(true);
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
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your company email to receive recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
          {isSent ? (
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Recovery Link Dispatched</h3>
              <p className="text-xs text-muted-foreground">
                If an account exists for that email, a secure reset link has been dispatched.
              </p>
              <Link href="/auth/sign-in">
                <Button className="w-full mt-2">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Registered Company Email"
                placeholder="name@company.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full h-10 mt-2">
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/sign-in"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
