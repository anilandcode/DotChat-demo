"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, SendHorizontal, Split } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelPicker } from "@/components/chat/model-picker";
import { ChatMessage } from "@/components/chat/message";
import { CitationPill } from "@/components/chat/citation-pill";
import { useDocChatStore } from "@/lib/store";
import type { CitationsPayload, DocChatUIMessage } from "@/ai/types";
import type { ModelChoice } from "@/lib/providers";

type CompareResult = {
  model: ModelChoice;
  text: string;
  latencyMs: number;
  usage: {
    inputTokens: number | null;
    outputTokens: number | null;
    totalTokens: number | null;
  };
};

type CompareResponse = {
  document: CitationsPayload["document"];
  chunks: CitationsPayload["chunks"];
  results: CompareResult[];
};

function stripMarkers(text: string) {
  return text.replace(/\[chunk_id:\s*[0-9a-fA-F-]{36}\]/g, "").replace(/\s{2,}/g, " ").trim();
}

function extractChunkIds(text: string) {
  const out: string[] = [];
  const re = /\[chunk_id:\s*([0-9a-fA-F-]{36})\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) out.push(match[1]);
  return Array.from(new Set(out));
}

function statusLabel(status: string) {
  if (status === "submitted") return "Embedding query...";
  if (status === "streaming") return "Generating grounded answer...";
  if (status === "error") return "Generation stopped.";
  return null;
}

function CompareResultCard(props: {
  result: CompareResult;
  payload: CompareResponse;
}) {
  const chunkIds = extractChunkIds(props.result.text);
  const pills = chunkIds
    .map((id) => props.payload.chunks.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => ({
      id: c!.id,
      page: c!.page,
      snippet: c!.content.slice(0, 480),
    }));

  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[var(--card-elevated)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="secondary">via {props.result.model === "kimi" ? "Kimi" : "DeepSeek"}</Badge>
        <div className="text-xs" style={{ color: "var(--foreground-3)" }}>
          {(props.result.latencyMs / 1000).toFixed(1)}s
          {props.result.usage.totalTokens ? ` · ${props.result.usage.totalTokens} tokens` : ""}
        </div>
      </div>
      <div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
        {stripMarkers(props.result.text)}
      </div>
      {pills.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {pills.map((p) => (
            <CitationPill
              key={p.id}
              filename={props.payload.document.filename}
              page={p.page}
              snippet={p.snippet}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ChatWindow() {
  const activeDocumentId = useDocChatStore((s) => s.activeDocumentId);
  const model = useDocChatStore((s) => s.model);
  const setModel = useDocChatStore((s) => s.setModel);

  const documentRef = useRef(activeDocumentId);
  const modelRef = useRef(model);
  const [input, setInput] = useState("");
  const [compare, setCompare] = useState<CompareResponse | null>(null);
  const [compareQuestion, setCompareQuestion] = useState("");
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  useEffect(() => {
    documentRef.current = activeDocumentId;
  }, [activeDocumentId]);

  useEffect(() => {
    modelRef.current = model;
  }, [model]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<DocChatUIMessage>({
        api: "/api/chat",
        prepareSendMessagesRequest({ messages }) {
          return {
            body: {
              messages,
              documentId: documentRef.current,
              model: modelRef.current,
            },
          };
        },
      }),
    [],
  );

  const {
    messages,
    sendMessage,
    status,
    error,
    clearError,
  } = useChat<DocChatUIMessage>({
    transport,
  });

  const loading = status !== "ready";
  const disabled = !activeDocumentId || loading || compareLoading;
  const progress = statusLabel(status);
  const otherModel = model === "kimi" ? "deepseek" : "kimi";

  async function sendCompare(question: string) {
    if (!activeDocumentId || compareLoading) return;
    const trimmed = question.trim();
    if (!trimmed) return;

    const nextMessages = [
      ...messages,
      {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text: trimmed }],
      } as DocChatUIMessage,
    ];

    setCompareQuestion(trimmed);
    setCompare(null);
    setCompareError(null);
    setCompareLoading(true);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, documentId: activeDocumentId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Compare failed");
      setCompare(json as CompareResponse);
      setInput("");
    } catch (e) {
      setCompareError(e instanceof Error ? e.message : "Compare failed");
    } finally {
      setCompareLoading(false);
    }
  }

  return (
    <div className="flex h-full min-h-[640px] flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
        <div>
          <div className="text-[15px] font-semibold">Chat</div>
          <div className="text-xs" style={{ color: "var(--foreground-2)" }}>
            Kimi answers. DeepSeek supports retrieval and comparison.
          </div>
        </div>
        <ModelPicker />
      </div>

      {(error || compareError) ? (
        <div className="mx-4 mt-4 rounded-[16px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 sm:mx-5">
          <div>{error?.message ?? compareError}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {error ? (
              <Button type="button" size="sm" variant="outline" onClick={() => clearError()}>
                Dismiss
              </Button>
            ) : null}
            <Button type="button" size="sm" variant="outline" onClick={() => setModel(otherModel)}>
              Try {otherModel === "kimi" ? "Kimi" : "DeepSeek"}
            </Button>
          </div>
        </div>
      ) : null}

      <div
        className="flex-1 overflow-auto px-4 py-4 sm:px-5"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {!activeDocumentId ? (
          <div className="flex h-full items-center justify-center text-center text-sm" style={{ color: "var(--foreground-2)" }}>
            Upload and select a document to start chatting.
          </div>
        ) : messages.length === 0 && !compare ? (
          <div className="space-y-3 text-sm" style={{ color: "var(--foreground-2)" }}>
            <div className="font-medium" style={{ color: "var(--foreground)" }}>Try asking:</div>
            <div className="flex flex-wrap gap-2">
              {[
                "Summarize this document in 3 bullet points",
                "What's the key takeaway?",
                "Are there any risks or warnings?",
                "Quote the most important paragraph",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded-full border border-[var(--border)] bg-transparent px-3 py-1.5 text-left text-[13px] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  onClick={() => setInput(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => {
              const text = (m.parts ?? [])
                .filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("");

              const citationsPart = (m.parts ?? []).find((p) => p.type === "data-citations") as
                | { type: "data-citations"; data: CitationsPayload }
                | undefined;

              return (
                <ChatMessage
                  key={m.id}
                  role={m.role as "user" | "assistant"}
                  text={text}
                  modelUsed={m.role === "assistant" ? citationsPart?.data.model ?? model : undefined}
                  citations={m.role === "assistant" ? citationsPart?.data ?? null : null}
                />
              );
            })}

            {compare ? (
              <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">Model comparison</div>
                    <div className="text-xs" style={{ color: "var(--foreground-2)" }}>
                      {compareQuestion}
                    </div>
                  </div>
                  <Badge variant="outline">{compare.chunks.length} chunks</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {compare.results.map((result) => (
                    <CompareResultCard key={result.model} result={result} payload={compare} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {progress || compareLoading ? (
        <div className="border-t border-[var(--border)] px-4 py-2 text-xs sm:px-5" style={{ color: "var(--accent)" }}>
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {compareLoading ? "Running Kimi and DeepSeek side by side..." : progress}
          </span>
        </div>
      ) : null}

      <form
        className="border-t border-[var(--border)] px-4 py-3 sm:px-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!activeDocumentId) return;
          const trimmed = input.trim();
          if (!trimmed) return;
          void sendMessage({ text: trimmed });
          setInput("");
        }}
      >
        <div className="flex gap-2">
          <input
            className="h-11 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none placeholder:text-[var(--foreground-3)] focus:border-transparent focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50"
            value={input}
            placeholder={activeDocumentId ? "Ask a question..." : "Select a document first"}
            onChange={(e) => setInput(e.currentTarget.value)}
            disabled={disabled}
            aria-label="Message input"
          />
          <Button type="button" variant="outline" disabled={disabled || input.trim().length === 0} onClick={() => sendCompare(input)} aria-label="Compare both models">
            <Split className="h-4 w-4" />
            <span className="hidden sm:inline">Compare</span>
          </Button>
          <Button type="submit" disabled={disabled || input.trim().length === 0} aria-label="Send message" size="icon">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
