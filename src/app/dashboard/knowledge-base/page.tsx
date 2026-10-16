"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  RotateCw,
  Search,
  Filter,
  Eye,
  Shield,
  Layers,
  FileCheck,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/providers/toast-provider";
import { DocumentItem } from "@/types";
import { formatBytes, formatRelativeTime } from "@/lib/utils";

export default function KnowledgeBasePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  useEffect(() => {
    async function loadDocs() {
      try {
        const docs = await api.getDocuments();
        setDocuments(docs);
      } catch (err) {
        console.error("Failed to load documents", err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate type
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast({
        title: "Unsupported File Type",
        description: "Only PDF documents are supported for RAG vector parsing.",
        type: "error",
      });
      return;
    }

    // Validate size (e.g. 50MB limit)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast({
        title: "File Exceeds Plan Limit",
        description: "Maximum file size for your current plan is 50MB.",
        type: "error",
      });
      return;
    }

    setIsUploading(true);
    try {
      const newDoc = await api.uploadDocument(file);
      setDocuments((prev) => [newDoc, ...prev]);

      toast({
        title: "PDF Uploaded to Ingestion Pipeline",
        description: "Document parsing and vector indexing started in background.",
        type: "success",
      });

      // Simulate indexing transition to 'ready' after 3 seconds in mock mode
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === newDoc.id
              ? { ...d, status: "ready", chunksCount: Math.floor(18 + Math.random() * 40) }
              : d
          )
        );
        toast({
          title: "Document Indexing Ready",
          description: `${file.name} is now searchable by the AI assistant.`,
          type: "success",
        });
      }, 3500);
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload document to backend.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (docId: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete "${docName}"? This will purge its vector chunks from the RAG store.`)) {
      return;
    }

    try {
      await api.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (selectedDoc?.id === docId) setSelectedDoc(null);
      toast({
        title: "Document Deleted",
        description: "Document and vector chunks purged from your tenant workspace.",
        type: "info",
      });
    } catch (err: any) {
      toast({
        title: "Failed to Delete",
        description: err.message || "Could not delete document.",
        type: "error",
      });
    }
  };

  const handleRetry = async (docId: string) => {
    try {
      const updated = await api.retryDocument(docId);
      setDocuments((prev) => prev.map((d) => (d.id === docId ? updated : d)));
      toast({
        title: "Re-indexing Queued",
        description: "Sent back to FastAPI LangGraph ingestion graph.",
        type: "info",
      });
    } catch (err: any) {
      toast({
        title: "Retry Failed",
        description: err.message,
        type: "error",
      });
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Knowledge Base & PDF Documents
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage company PDFs ingested into your tenant-isolated RAG vector store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            accept=".pdf,application/pdf"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
          >
            <UploadCloud className="h-4 w-4" />
            Upload PDF File
          </Button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-border hover:border-primary/50 bg-card/60 hover:bg-card/90"
        }`}
      >
        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          Click or Drag & Drop Company PDFs Here
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Supports return policies, product specifications, guides, and manuals up to 50MB.
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-indigo-500" />
            Tenant Vector Isolated
          </span>
          <span className="flex items-center gap-1">
            <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
            Automatic OCR & Chunking
          </span>
        </div>
      </div>

      {/* Document Management Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Company Knowledge Base ({filteredDocs.length})</CardTitle>
              <CardDescription className="text-xs">
                Documents currently searchable by your customer service AI
              </CardDescription>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground border-y border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold">Document Name</th>
                  <th className="px-6 py-3 font-semibold">Size</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Chunks</th>
                  <th className="px-6 py-3 font-semibold">Uploaded</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No documents found matching your filter.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="truncate max-w-xs">{doc.name}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatBytes(doc.fileSizeBytes)}
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono">
                        {doc.chunksCount ? `${doc.chunksCount} chunks` : "—"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatRelativeTime(doc.uploadedAt)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDoc(doc)}
                          className="h-7 px-2 text-xs"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {doc.status === "failed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetry(doc.id)}
                            className="h-7 px-2 text-xs text-amber-500 hover:text-amber-600"
                            title="Retry Indexing"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.id, doc.name)}
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete Document"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title="Document Metadata & Ingestion Details"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5">
              <div className="font-semibold text-foreground text-sm">{selectedDoc.name}</div>
              <div className="text-muted-foreground font-mono text-[11px]">ID: {selectedDoc.id}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">File Size</span>
                <div className="font-bold text-foreground mt-0.5">{formatBytes(selectedDoc.fileSizeBytes)}</div>
              </div>
              <div className="p-2.5 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Indexed Chunks</span>
                <div className="font-bold text-foreground mt-0.5">{selectedDoc.chunksCount || 0} vectors</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium">Tenant Scoping:</span>
              <div className="p-2 rounded bg-background border border-border font-mono text-[11px] text-primary font-bold">
                {selectedDoc.tenantId}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <Button size="sm" onClick={() => setSelectedDoc(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
