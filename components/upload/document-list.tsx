"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Document } from "@/lib/types";
import { useDocChatStore } from "@/lib/store";

type ApiResponse = { documents: Document[]; configured?: boolean; error?: string };

export function DocumentList({ refreshKey }: { refreshKey: number }) {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeDocumentId = useDocChatStore((s) => s.activeDocumentId);
  const setActiveDocumentId = useDocChatStore((s) => s.setActiveDocumentId);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/documents")
      .then((r) => r.json())
      .then((json: ApiResponse) => {
        if (cancelled) return;
        if (json.error) setError(json.error);
        setDocs(json.documents ?? []);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load documents");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const empty = useMemo(() => !loading && !error && docs.length === 0, [docs.length, error, loading]);

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] p-0">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="editorial-label text-[var(--muted)]">Documents</div>
        <Badge variant="secondary">{docs.length}</Badge>
      </div>

      <div className="space-y-0">
        {loading ? (
          <div className="px-4 py-4 text-sm" style={{ color: "var(--foreground-2)" }}>
            Loading...
          </div>
        ) : null}
        {error ? (
          <div className="m-4 border border-red-700/30 bg-red-100 px-3 py-2 text-sm text-red-900">
            {error}
          </div>
        ) : null}
        {empty ? (
          <div className="px-4 py-4 text-sm" style={{ color: "var(--foreground-2)" }}>
            Upload a PDF to begin.
          </div>
        ) : null}

        {docs.map((d) => {
          const isActive = d.id === activeDocumentId;
          return (
            <button
              key={d.id}
              type="button"
              className="w-full text-left"
              onClick={() => setActiveDocumentId(d.id)}
            >
              <div
                className="border-b border-[var(--border)] px-4 py-4 transition-colors duration-150 hover:bg-[rgba(0,0,0,0.03)]"
                style={{
                  borderLeft: isActive ? "4px solid var(--black)" : "4px solid transparent",
                  background: isActive ? "var(--accent-soft)" : "var(--surface)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-bold">{d.filename}</div>
                    <div className="mt-0.5 text-xs" style={{ color: "var(--foreground-2)" }}>
                      {d.pages ? `${d.pages} pages` : "No pages yet"} - {(d.size_bytes / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  <Badge variant={d.status === "ready" ? "default" : d.status === "error" ? "destructive" : "secondary"}>
                    {d.status ?? "unknown"}
                  </Badge>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
