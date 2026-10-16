"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Copy,
  Check,
  Bot,
  ExternalLink,
  Sun,
  Moon,
  Info,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/components/providers/theme-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const { tenant, user } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showTenantInfo, setShowTenantInfo] = useState(false);

  const copyTenantId = () => {
    if (tenant?.id) {
      navigator.clipboard.writeText(tenant.id);
      setCopied(true);
      toast({
        title: "Tenant ID Copied",
        description: "Your unique tenant workspace identifier is in your clipboard.",
        type: "info",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left items: Menu button & Tenant ID Display */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Tenant identifier chip with copy button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border text-xs">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Tenant:</span>
            <span className="font-mono font-semibold text-primary">{tenant?.id || "tnt_apex_9921"}</span>
            <button
              onClick={copyTenantId}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Copy Tenant ID"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
            <button
              onClick={() => setShowTenantInfo(!showTenantInfo)}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Tenant Security Policy"
            >
              <Info className="h-3 w-3" />
            </button>
          </div>

          <Badge variant="success" className="hidden md:inline-flex text-[10px] items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Assistant Active
          </Badge>
        </div>

        {/* Tenant ID Security Note popover */}
        {showTenantInfo && (
          <div className="absolute top-16 left-6 z-50 max-w-sm p-4 rounded-xl border border-border bg-card shadow-xl text-xs space-y-2 animate-in fade-in slide-in-from-top-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" />
              Tenant ID Architecture
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              "The Tenant ID identifies your company's workspace. It is not a password, API key, or proof of authorization."
            </p>
            <p className="text-[10px] text-muted-foreground">
              All backend endpoints require a valid JWT token signed for your user membership.
            </p>
            <button
              onClick={() => setShowTenantInfo(false)}
              className="text-[10px] text-primary hover:underline font-semibold block pt-1"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Customer chat preview shortcut */}
        <Link href={`/widget/${tenant?.id || "tnt_apex_9921"}`} target="_blank">
          <Button size="sm" variant="outline" className="hidden sm:inline-flex gap-1.5 text-xs h-8">
            <Bot className="h-3.5 w-3.5 text-primary" />
            Preview Customer Chat
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </Button>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User Role & Name */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/20">
            {user?.name?.[0] || "A"}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground leading-none">{user?.name || "Alex Morgan"}</span>
            <span className="text-[10px] text-muted-foreground capitalize mt-0.5">{user?.role || "owner"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
