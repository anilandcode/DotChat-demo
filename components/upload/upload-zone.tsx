"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  onUploaded?: () => void;
};

export function UploadZone({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setLastFile(file);
    setError(null);
    setIsBusy(true);
    setStatus("Uploading PDF...");
    try {
      const fd = new FormData();
      fd.set("file", file);
      setStatus("Parsing and embedding...");
      const res = await fetch("/api/ingest", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Upload failed");
      setStatus(`Ready: ${json?.pages ?? "?"} pages, ${json?.chunks ?? "?"} chunks indexed`);
      onUploaded?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setStatus(null);
    } finally {
      setIsBusy(false);
    }
  }

  function onDrop(ev: React.DragEvent) {
    ev.preventDefault();
    const f = ev.dataTransfer.files?.[0];
    if (f) void upload(f);
  }

  return (
    <Card className="p-5">
      <div
        className="rounded-[16px] border border-dashed p-6 transition-colors hover:border-[var(--border-strong)]"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "var(--accent-soft)" }}>
            <Upload className="h-5 w-5" style={{ color: "var(--accent)" }} />
          </div>
          <div className="space-y-1">
            <div className="text-[15px] font-medium">Drop a PDF here, or click to browse</div>
            <div className="text-sm" style={{ color: "var(--foreground-2)" }}>
              Max 10MB.
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />

          <Button type="button" disabled={isBusy} onClick={() => inputRef.current?.click()}>
            {isBusy ? "Working…" : "Choose file"}
          </Button>

          {status ? (
            <div className="text-xs" style={{ color: isBusy ? "var(--accent)" : "var(--foreground-2)" }}>
              {status}
            </div>
          ) : null}

          {error ? (
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-[14px] border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              <span>{error}</span>
              {lastFile ? (
                <button className="font-medium underline underline-offset-2" type="button" onClick={() => upload(lastFile)}>
                  Retry
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
