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

export function ChatMessage(props: {
  role: "user" | "assistant";
  text: string;
  modelUsed?: "kimi" | "deepseek";
  citations?: CitationsPayload | null;
}) {
  const { role, text, modelUsed, citations } = props;
  const isUser = role === "user";

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
        className="max-w-[85%] rounded-xl border px-4 py-3"
        style={{
          borderColor: "var(--border)",
          background: isUser ? "color-mix(in_srgb,var(--accent-soft)_65%,transparent)" : "var(--panel)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm whitespace-pre-wrap">{display}</div>
          {!isUser && modelUsed ? (
            <Badge variant="secondary" className="shrink-0">
              via {modelUsed === "kimi" ? "Kimi" : "DeepSeek"}
            </Badge>
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
      </div>
    </div>
  );
}

