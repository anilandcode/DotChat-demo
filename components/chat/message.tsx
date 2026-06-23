"use client";

import { Badge } from "@/components/ui/badge";
import { CitationPill } from "@/components/chat/citation-pill";
import type { CitationsPayload } from "@/ai/types";

function stripMarkers(text: string) {
  return text.replace(/\[chunk_id:\s*[0-9a-fA-F-]{36}\]/g, "").replace(/\s{2,}/g, " ").trim();
}

function extractChunkIds(text: string) {
  const out: string[] = [];
  const re = /\[chunk_id:\s*([0-9a-fA-F-]{36})\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push(m[1]);
  return Array.from(new Set(out));
}

/* Map a retrieval-confidence score (best chunk similarity, 0..1) to a graded,
   color-coded state — the trust/uncertainty UI pattern. */
function confidenceMeta(c: number): { level: "high" | "medium" | "low"; color: string; label: string } {
  if (c >= 0.7) return { level: "high", color: "#15803d", label: "High confidence" };
  if (c >= 0.5) return { level: "medium", color: "#b45309", label: "Medium confidence" };
  return { level: "low", color: "#b91c1c", label: "Low confidence" };
}

export function ChatMessage(props: {
  role: "user" | "assistant";
  text: string;
  modelUsed?: "kimi" | "deepseek";
  citations?: CitationsPayload | null;
}) {
  const { role, text, modelUsed, citations } = props;
  const isUser = role === "user";
  const conf = !isUser && citations ? confidenceMeta(citations.confidence) : null;

  const display = isUser ? text : stripMarkers(text);
  const chunkIds = isUser ? [] : extractChunkIds(text);

  const pills =
    citations && chunkIds.length
      ? chunkIds
          .map((id) => citations.chunks.find((c) => c.id === id))
          .filter(Boolean)
          .map((c) => ({
            id: c!.id,
            page: c!.page,
            snippet: c!.content.slice(0, 480),
          }))
      : [];

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className="max-w-[92%] rounded-none border px-4 py-3 sm:max-w-[85%]"
        style={{
          borderColor: isUser ? "var(--black)" : "var(--border)",
          background: isUser ? "var(--foreground)" : "var(--card-elevated)",
          color: isUser ? "var(--surface)" : "var(--foreground)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="text-[13px] leading-relaxed whitespace-pre-wrap">{display}</div>
          {!isUser && (modelUsed || conf) ? (
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {modelUsed ? (
                <Badge variant="secondary">
                  via {modelUsed === "kimi" ? "Kimi" : "DeepSeek"}
                </Badge>
              ) : null}
              {conf ? (
                <span
                  className="editorial-label inline-flex items-center gap-1.5"
                  style={{ color: conf.color }}
                  title={`Top retrieval similarity ${citations!.confidence}`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: conf.color }} aria-hidden="true" />
                  {conf.label}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {!isUser && pills.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {pills.map((p) => (
              <CitationPill
                key={p.id}
                filename={citations!.document.filename}
                page={p.page}
                snippet={p.snippet}
              />
            ))}
          </div>
        ) : null}

        {!isUser && conf && conf.level !== "high" ? (
          <div
            className="mt-3 border px-3 py-2 text-[12px] leading-5"
            style={{ borderColor: conf.color, color: conf.color, background: "rgba(0,0,0,0.02)" }}
          >
            {conf.level === "low"
              ? "Low retrieval confidence — the document may not cover this. Verify the cited pages or rephrase."
              : "Medium confidence — double-check the answer against the cited pages."}
          </div>
        ) : null}
      </div>
    </div>
  );
}
