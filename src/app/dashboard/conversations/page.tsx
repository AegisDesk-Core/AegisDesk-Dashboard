"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Bot,
  FileText,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { Conversation, ChatMessage } from "@/types";
import { formatRelativeTime, formatDate } from "@/lib/utils";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "resolved" | "escalated">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadConversations() {
      try {
        const convs = await api.getConversations();
        setConversations(convs);
        if (convs.length > 0) {
          setSelectedConv(convs[0]);
        }
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedConv) return;
    async function loadMessages() {
      setMessagesLoading(true);
      try {
        const msgs = await api.getConversationMessages(selectedConv!.id);
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setMessagesLoading(false);
      }
    }
    loadMessages();
  }, [selectedConv]);

  const filteredConversations = conversations.filter((c) => {
    const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    const matchesSearch =
      c.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerIdentifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Customer Conversations
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Search customer inquiries, inspect AI responses, and review retrieved knowledge base citations.
          </p>
        </div>
      </div>

      {/* Main Two-Pane Chat View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Pane: Conversation List */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="p-4 pb-3 border-b border-border space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customer, topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1">
                {(["all", "active", "resolved", "escalated"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${
                      filterStatus === st
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-y-auto divide-y divide-border">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No conversations matching current filter.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedConv?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConv(conv)}
                      className={`p-4 cursor-pointer transition-colors text-left flex items-start justify-between gap-3 ${
                        isSelected ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="space-y-1 max-w-[80%]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground">
                            {conv.customerName || conv.customerIdentifier}
                          </span>
                          <Badge
                            variant={
                              conv.status === "resolved"
                                ? "success"
                                : conv.status === "escalated"
                                ? "destructive"
                                : "warning"
                            }
                            className="text-[9px] py-0 capitalize"
                          >
                            {conv.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {conv.summary || "Customer support inquiry"}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-muted-foreground block font-mono">
                          {formatRelativeTime(conv.lastActivityAt)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {conv.messageCount} msgs
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Pane: Conversation Transcript & Citation Inspector */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            {selectedConv ? (
              <>
                {/* Transcript Header */}
                <CardHeader className="p-4 border-b border-border bg-muted/30 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">
                        {selectedConv.customerName || selectedConv.customerIdentifier}
                      </h3>
                      <Badge variant="secondary" className="text-[10px]">
                        ID: {selectedConv.id}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Started {formatDate(selectedConv.startedAt)} • Tenant {selectedConv.tenantId}
                    </p>
                  </div>
                  <Badge
                    variant={
                      selectedConv.status === "resolved"
                        ? "success"
                        : selectedConv.status === "escalated"
                        ? "destructive"
                        : "warning"
                    }
                    className="capitalize text-xs"
                  >
                    {selectedConv.status}
                  </Badge>
                </CardHeader>

                {/* Messages Body */}
                <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[500px]">
                  {messagesLoading ? (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      Loading conversation transcript...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      No messages recorded in this session.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.sender === "customer" ? "items-start" : "items-end"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-muted-foreground">
                          {msg.sender === "customer" ? (
                            <User className="h-3 w-3" />
                          ) : (
                            <Bot className="h-3 w-3 text-primary" />
                          )}
                          <span className="capitalize">{msg.sender}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(msg.timestamp)}</span>
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                            msg.sender === "customer"
                              ? "bg-muted/70 text-foreground rounded-tl-none border border-border"
                              : "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* Citation Badges */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-2 space-y-1.5 max-w-[85%]">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                              Retrieved Source Citations:
                            </span>
                            {msg.citations.map((cite, cIdx) => (
                              <div
                                key={cIdx}
                                className="p-2.5 rounded-xl bg-card border border-border text-[11px] text-muted-foreground space-y-1 shadow-sm"
                              >
                                <div className="flex items-center justify-between font-semibold text-foreground">
                                  <span className="flex items-center gap-1 text-primary">
                                    <FileText className="h-3.5 w-3.5" />
                                    {cite.documentName}
                                  </span>
                                  <Badge variant="success" className="text-[9px] py-0">
                                    {Math.round(cite.relevanceScore * 100)}% match
                                  </Badge>
                                </div>
                                <p className="italic text-foreground/80 line-clamp-2">
                                  "{cite.chunkSnippet}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>

                {/* Footer Notice */}
                <div className="p-3 border-t border-border bg-muted/20 text-[10px] text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    Customer logs strictly isolated in tenant database
                  </span>
                  <span>LangGraph Agent State Verified</span>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-xs text-muted-foreground">
                Select a conversation on the left to inspect its messages and citations.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
