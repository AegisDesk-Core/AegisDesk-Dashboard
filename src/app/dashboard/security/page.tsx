"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Key,
  Lock,
  Copy,
  Check,
  RotateCw,
  Eye,
  EyeOff,
  Server,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/providers/toast-provider";

export default function TenantSecurityDashboardPage() {
  const { tenant } = useAuth();
  const { toast } = useToast();

  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState("omni_live_sk_9a87f2e10c4d5b6e");
  const [webhookSecret, setWebhookSecret] = useState("whsec_77b312ad8e91ff24");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const copyToClipboard = (text: string, isSecret: boolean) => {
    navigator.clipboard.writeText(text);
    if (isSecret) {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
    toast({
      title: "Copied to Clipboard",
      description: "Secret key copied securely.",
      type: "info",
    });
  };

  const handleRollKey = () => {
    if (confirm("Are you sure you want to regenerate your API key? Active integrations must be updated.")) {
      const newKey = `omni_live_sk_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
      setApiKey(newKey);
      toast({
        title: "API Key Regenerated",
        description: "Old key invalidated. Update backend webhooks and connectors.",
        type: "warning",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tenant Security & API Credentials
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your tenant API keys, webhook signing secrets, and data partition policies.
          </p>
        </div>
      </div>

      {/* Security Architecture Notice */}
      <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="font-bold text-foreground">Multi-Tenant Cryptographic Partitioning Active</div>
          <p>
            Your organization's documents, LangGraph conversation states, and vector indices in PostgreSQL are scoped to Tenant ID <code className="font-mono text-primary font-semibold">{tenant?.id || "tnt_apex_9921"}</code>. Cross-tenant leakage is strictly prevented at the database and application levels.
          </p>
        </div>
      </div>

      {/* API Keys Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Backend API Keys</CardTitle>
              <CardDescription className="text-xs">
                Secret keys for server-to-server FastAPI backend integration
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRollKey} className="text-xs gap-1">
              <RotateCw className="h-3.5 w-3.5" />
              Regenerate Key
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="p-3 rounded-xl border border-border bg-muted/40 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Production Secret Key</span>
              <span className="text-[10px]">Created Oct 01, 2024</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border font-mono text-xs">
              <span className="text-foreground">
                {showKey ? apiKey : "••••••••••••••••••••••••••••••••"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => copyToClipboard(apiKey, false)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground"
                >
                  {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border bg-muted/40 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Webhook Signing Secret</span>
              <span className="text-[10px]">For verifying incoming payment & ticketing events</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border font-mono text-xs">
              <span className="text-foreground">{webhookSecret}</span>
              <button
                onClick={() => copyToClipboard(webhookSecret, true)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                {copiedSecret ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Snapshot */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Security & Access Logs</CardTitle>
          <CardDescription className="text-xs">
            Immutable audit record of administrative actions taken within this workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-foreground">AI Assistant Prompt Updated</span>
              <span className="text-muted-foreground block text-[11px]">By Alex Morgan (Owner) • IP: 192.168.1.1</span>
            </div>
            <span className="font-mono text-muted-foreground text-[10px]">Today, 11:45 AM</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-foreground">Document Ingested: Warranty_and_Repairs_Guidelines_Q4.pdf</span>
              <span className="text-muted-foreground block text-[11px]">By Rachel Chang (Admin)</span>
            </div>
            <span className="font-mono text-muted-foreground text-[10px]">Yesterday, 08:05 AM</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-foreground">Member Invited: Sophia Nguyen (agent)</span>
              <span className="text-muted-foreground block text-[11px]">By Alex Morgan (Owner)</span>
            </div>
            <span className="font-mono text-muted-foreground text-[10px]">Oct 10, 2024</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
