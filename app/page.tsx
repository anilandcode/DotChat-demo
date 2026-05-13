"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UploadZone } from "@/components/upload/upload-zone";
import { DocumentList } from "@/components/upload/document-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">DocChat</h1>
              <Badge variant="secondary">RAG demo</Badge>
            </div>
            <p className="max-w-2xl text-[15px] leading-6" style={{ color: "var(--foreground-2)" }}>
              Drop in PDFs. Ask anything. Get answers with cited sources.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline">Kimi K2.6</Badge>
            <Badge variant="outline">DeepSeek V4 Pro</Badge>
            <Badge variant="outline">Supabase pgvector</Badge>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">Documents</div>
              <Badge variant="secondary">Upload</Badge>
            </div>
            <div className="mt-4 space-y-4">
              <UploadZone onUploaded={() => setRefreshKey((k) => k + 1)} />
              <DocumentList refreshKey={refreshKey} />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">Chat</div>
              <Badge variant="secondary">Citations</Badge>
            </div>
            <div className="mt-4 h-[520px]">
              <ChatWindow />
            </div>
          </Card>
        </div>

        <div className="mt-10 border-t pt-6 text-sm" style={{ borderColor: "var(--border)", color: "var(--foreground-2)" }}>
          Built by Anil Pervaiz — full-stack AI architect
        </div>
      </div>
    </div>
  );
}
