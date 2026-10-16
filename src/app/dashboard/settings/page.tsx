"use client";

import React, { useState } from "react";
import {
  Building,
  Save,
  Copy,
  Check,
  Shield,
  Palette,
  Globe,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/providers/toast-provider";

export default function CompanySettingsPage() {
  const { tenant, setTenantState } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(tenant?.name || "Apex Retail Hub");
  const [website, setWebsite] = useState(tenant?.website || "https://apexretail.io");
  const [supportEmail, setSupportEmail] = useState(tenant?.supportEmail || "support@apexretail.io");
  const [defaultLanguage, setDefaultLanguage] = useState(tenant?.defaultLanguage || "English (US)");
  const [timeZone, setTimeZone] = useState(tenant?.timeZone || "America/New_York (UTC-5)");
  const [brandColor, setBrandColor] = useState(tenant?.brandColor || "#6366f1");
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateTenantSettings({
        name,
        website,
        supportEmail,
        defaultLanguage,
        timeZone,
        brandColor,
      });
      setTenantState(updated);
      toast({
        title: "Company Settings Saved",
        description: "Profile and branding parameters updated successfully.",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Failed to Save",
        description: err.message || "An error occurred while updating settings.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Company Profile & Branding
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure organization metadata, support contacts, and customer chat widget branding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Settings Form */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization Profile</CardTitle>
                <CardDescription className="text-xs">
                  Public profile details visible in email notifications and chat headers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Company Display Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Retail Hub"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Official Support Email *"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@company.com"
                    required
                  />
                  <Input
                    label="Company Website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-medium text-foreground">Default Support Language</label>
                    <select
                      value={defaultLanguage}
                      onChange={(e) => setDefaultLanguage(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background/70 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="Spanish (ES)">Spanish (ES)</option>
                      <option value="French (FR)">French (FR)</option>
                      <option value="German (DE)">German (DE)</option>
                      <option value="Portuguese (BR)">Portuguese (BR)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="font-medium text-foreground">Operating Time Zone</label>
                    <select
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background/70 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
                      <option value="America/Los_Angeles (UTC-8)">America/Los_Angeles (UTC-8)</option>
                      <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
                      <option value="Europe/Paris (UTC+1)">Europe/Paris (UTC+1)</option>
                      <option value="Asia/Tokyo (UTC+9)">Asia/Tokyo (UTC+9)</option>
                      <option value="Asia/Kolkata (UTC+5:30)">Asia/Kolkata (UTC+5:30)</option>
                    </select>
                  </div>
                </div>

                {/* Brand Color Picker */}
                <div className="pt-2 border-t border-border/60">
                  <label className="block text-xs font-semibold text-foreground mb-2">
                    Customer Chat Widget Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="h-10 w-14 rounded-lg border border-input p-1 cursor-pointer bg-card"
                    />
                    <Input
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      placeholder="#6366f1"
                      className="w-36 font-mono text-xs"
                    />
                    <span className="text-[11px] text-muted-foreground">
                      Applied to customer chat bubble & header banner
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right Column: Tenant Identifier & Security Rules */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Workspace Tenant ID</CardTitle>
              <CardDescription className="text-xs">
                Unique identifier for multi-tenant isolation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/40 space-y-2">
                <div className="text-[11px] text-muted-foreground">Tenant Identifier:</div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border font-mono font-bold text-primary">
                  <span>{tenant?.id || "tnt_apex_9921"}</span>
                  <button
                    onClick={copyTenantId}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  Tenant ID Security Policy
                </div>
                <p>
                  "The Tenant ID identifies your company's workspace. It is not a password, API key, or proof of authorization."
                </p>
                <p>
                  The frontend never allows an ordinary user to switch to another tenant merely by editing a Tenant ID. Authorization is cryptographically verified by the backend.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
