"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Bot,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Shield,
  UploadCloud,
  Sliders,
  Users,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/providers/toast-provider";
import {
  Conversation,
  DocumentItem,
  SubscriptionInfo,
  AnalyticsData,
} from "@/types";
import { formatRelativeTime } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { tenant } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [subData, docsData, convsData, anData] = await Promise.all([
          api.getSubscription(),
          api.getDocuments(),
          api.getConversations(),
          api.getAnalytics("30d"),
        ]);
        setSubscription(subData);
        setDocuments(docsData);
        setConversations(convsData);
        setAnalytics(anData);
      } catch (err) {
        console.error("Failed to load dashboard overview data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const copyTenantId = () => {
    if (tenant?.id) {
      navigator.clipboard.writeText(tenant.id);
      setCopied(true);
      toast({
        title: "Tenant ID Copied",
        description: "Your unique workspace identifier is copied to clipboard.",
        type: "info",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const processingDocsCount = documents.filter((d) => d.status === "processing" || d.status === "queued").length;
  const readyDocsCount = documents.filter((d) => d.status === "ready").length;

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Top Welcome & Tenant Scoping Card */}
      <div className="p-6 rounded-2xl border border-border bg-gradient-to-r from-card via-card to-indigo-500/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {tenant?.name || "Apex Retail Hub"}
            </h1>
            <Badge variant="success">AI Support Online</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Isolated multi-tenant workspace managed by Python FastAPI & LangGraph RAG pipeline.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border text-xs">
              <span className="text-[11px] text-muted-foreground">Tenant ID:</span>
              <code className="font-mono font-bold text-primary">{tenant?.id || "tnt_apex_9921"}</code>
              <button
                onClick={copyTenantId}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Copy Tenant ID"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <Badge variant="indigo" className="text-xs font-semibold capitalize py-1">
              {tenant?.subscriptionPlan || "professional"} Plan • {tenant?.subscriptionStatus || "Active"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/dashboard/knowledge-base">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs">
              <UploadCloud className="h-3.5 w-3.5" />
              Upload PDF
            </Button>
          </Link>
          <Link href={`/widget/${tenant?.id || "tnt_apex_9921"}`} target="_blank">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Bot className="h-3.5 w-3.5 text-primary" />
              Customer Chat
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversations */}
        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {analytics?.metrics.totalConversations.toLocaleString() || "1,248"}
                </div>
                <p className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{analytics?.metrics.totalConversationsChange || 18.4}% vs previous 30d
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Messages */}
        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Messages
            </CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {analytics?.metrics.totalMessages.toLocaleString() || "4,890"}
                </div>
                <p className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{analytics?.metrics.totalMessagesChange || 22.1}% query volume
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Documents Uploaded & Ready */}
        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Ingested Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {documents.length} Files
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                  <span className="text-emerald-500 font-semibold">{readyDocsCount} ready</span>
                  <span>•</span>
                  <span>{processingDocsCount} queued/processing</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* AI Resolution Rate & Latency */}
        <Card className="glow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              AI Auto-Resolution Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {analytics?.metrics.resolutionRate || 91.5}%
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Avg latency: <span className="font-semibold text-foreground">{analytics?.metrics.avgLatencyMs || 840}ms</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Usage Limits Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Monthly Quota & Usage Limits</CardTitle>
              <CardDescription className="text-xs">
                Real-time consumption for {subscription?.planName || "Professional Plan"} (Renewing Nov 1, 2024)
              </CardDescription>
            </div>
            <Link href="/dashboard/billing">
              <Button variant="outline" size="sm" className="text-xs h-8">
                Manage Subscription
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Message consumption */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Monthly Conversations</span>
                  <span className="font-semibold text-foreground">
                    {subscription?.usage.messagesUsed.toLocaleString()} / {subscription?.usage.messagesLimit.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={subscription ? (subscription.usage.messagesUsed / subscription.usage.messagesLimit) * 100 : 32}
                  className="h-2"
                />
                <div className="text-[10px] text-muted-foreground">
                  {subscription ? Math.round((subscription.usage.messagesUsed / subscription.usage.messagesLimit) * 100) : 32}% used
                </div>
              </div>

              {/* Document limit */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Knowledge Base Documents</span>
                  <span className="font-semibold text-foreground">
                    {documents.length} / {subscription?.usage.documentsLimit || 100} PDFs
                  </span>
                </div>
                <Progress
                  value={subscription ? (documents.length / subscription.usage.documentsLimit) * 100 : 5}
                  className="h-2"
                />
                <div className="text-[10px] text-muted-foreground">
                  {subscription ? Math.round((documents.length / subscription.usage.documentsLimit) * 100) : 5}% capacity
                </div>
              </div>

              {/* Team seats */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Team Member Seats</span>
                  <span className="font-semibold text-foreground">
                    {subscription?.usage.teamSeatsUsed || 4} / {subscription?.usage.teamSeatsLimit || 10} Seats
                  </span>
                </div>
                <Progress
                  value={subscription ? ((subscription.usage.teamSeatsUsed || 4) / subscription.usage.teamSeatsLimit) * 100 : 40}
                  className="h-2"
                />
                <div className="text-[10px] text-muted-foreground">
                  6 seats available for staff
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Section: Recent Conversations & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Recent Customer Inquiries</CardTitle>
              <CardDescription className="text-xs">Incoming queries handled by AI and staff</CardDescription>
            </div>
            <Link href="/dashboard/conversations">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {conversations.slice(0, 4).map((conv) => (
              <div key={conv.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1 max-w-[75%]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{conv.customerName || conv.customerIdentifier}</span>
                    <Badge
                      variant={
                        conv.status === "resolved"
                          ? "success"
                          : conv.status === "escalated"
                          ? "destructive"
                          : "warning"
                      }
                      className="text-[10px] py-0 capitalize"
                    >
                      {conv.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground line-clamp-1">
                    {conv.summary || "Inquiry on store catalog and delivery"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    {formatRelativeTime(conv.lastActivityAt)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {conv.messageCount} messages
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Documents Ingested */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Knowledge Base Activity</CardTitle>
              <CardDescription className="text-xs">Indexed PDFs powering the RAG assistant</CardDescription>
            </div>
            <Link href="/dashboard/knowledge-base">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                Manage PDFs
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {documents.slice(0, 4).map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 max-w-[70%]">
                  <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div className="truncate">
                    <div className="font-medium text-foreground truncate">{doc.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(doc.uploadedAt)} • {(doc.fileSizeBytes / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>
                </div>
                <div>
                  <Badge
                    variant={
                      doc.status === "ready"
                        ? "success"
                        : doc.status === "processing"
                        ? "warning"
                        : doc.status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize text-[10px]"
                  >
                    {doc.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Architecture Callout Note */}
      <div className="p-4 rounded-xl border border-border/80 bg-muted/30 text-xs text-muted-foreground flex items-center gap-3">
        <Shield className="h-4 w-4 text-indigo-500 shrink-0" />
        <div>
          <span className="font-semibold text-foreground">Multi-Tenant Isolation Notice: </span>
          The Tenant ID <code className="font-mono text-primary font-bold">{tenant?.id || "tnt_apex_9921"}</code> identifies your workspace partition. It is not an API key or password. Every request is verified via JWT tokens on FastAPI before access is authorized.
        </div>
      </div>
    </div>
  );
}
