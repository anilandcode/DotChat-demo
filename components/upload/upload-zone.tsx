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
  const [status, setStatus] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setIsBusy(true);
    setStatus("Uploading…");
    try {
      const fd = new FormData();
      fd.set("file", file);
      setStatus("Parsing PDF…");
      const res = await fetch("/api/ingest", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Upload failed");
      setStatus("Ready");
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
    <Card className="p-4">
      <div
        className="rounded-md border border-dashed p-6"
        style={{ borderColor: "var(--border)" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--accent-soft)" }}>
            <Upload className="h-5 w-5" style={{ color: "var(--accent)" }} />
          </div>
          <div className="space-y-1">
            <div className="font-medium">Drop a PDF here, or click to browse</div>
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
            <div className="text-xs" style={{ color: "var(--foreground-2)" }}>
              {status}
            </div>
          ) : null}

          {error ? (
            <div className="text-xs text-red-600">
              {error}{" "}
              <button className="underline" type="button" onClick={() => setError(null)}>
                dismiss
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

