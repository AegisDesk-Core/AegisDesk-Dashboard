"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  FileText,
  MessageSquare,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { tenant, signOut } = useAuth();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Assistant", href: "/dashboard/assistant", icon: Bot },
    { label: "Knowledge Base", href: "/dashboard/knowledge-base", icon: FileText },
    { label: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Team Members", href: "/dashboard/team", icon: Users },
    { label: "Subscription & Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Company Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Security & Keys", href: "/dashboard/security", icon: Shield },
    { label: "Help & Documentation", href: "/docs", icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-border bg-card/95 backdrop-blur-md flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-16 px-5 border-b border-border flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-foreground">AegisDesk</span>
                <span className="text-[10px] text-muted-foreground font-mono">Tenant Workspace</span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tenant pill */}
          <div className="p-3 mx-3 mt-3 rounded-xl bg-muted/40 border border-border/60">
            <div className="text-[11px] font-bold text-foreground truncate">
              {tenant?.name || "Apex Retail Hub"}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] font-mono text-muted-foreground truncate">
                {tenant?.id || "tnt_apex_9921"}
              </span>
              <Badge variant="indigo" className="text-[9px] py-0 px-1.5 uppercase font-semibold">
                {tenant?.subscriptionPlan || "pro"}
              </Badge>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom sign out */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => {
              signOut();
              window.location.href = "/auth/sign-in";
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
