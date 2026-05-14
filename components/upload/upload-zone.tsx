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
    <Card className="border-[var(--border)] bg-[var(--surface)] p-0">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <div className="editorial-label text-[var(--muted)]">Upload</div>
      </div>
      <div
        className="border border-dashed border-transparent p-6 transition-colors duration-150 hover:border-[var(--border-strong)]"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center border border-[var(--border-strong)] bg-[var(--accent)]">
            <Upload className="h-5 w-5 text-[var(--black)]" />
          </div>
          <div className="space-y-2">
            <div className="font-serif text-[24px] leading-none">Drop a PDF</div>
            <div className="max-w-[260px] text-[12px] leading-5 text-[var(--muted)]">
              Extract page text, embed chunks, and activate grounded chat. Max 10MB.
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

          <Button type="button" disabled={isBusy} onClick={() => inputRef.current?.click()} className="w-full justify-between">
            {isBusy ? "Working..." : "Choose file"}
            <span aria-hidden="true">+</span>
          </Button>

          {status ? (
            <div className="editorial-label text-[var(--muted)]" style={{ color: isBusy ? "var(--black)" : "var(--muted)" }}>
              {status}
            </div>
          ) : null}

          {error ? (
            <div className="w-full border border-red-700/30 bg-red-100 px-3 py-3 text-xs text-red-900">
              <div className="editorial-label text-red-900">Upload failed</div>
              <div className="mt-2 leading-5">{error}</div>
              {lastFile ? (
                <button className="editorial-label mt-3 underline underline-offset-2" type="button" onClick={() => upload(lastFile)}>
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
