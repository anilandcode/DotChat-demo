"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FileSearch, Loader2, SendHorizontal, Split } from "lucide-react";
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

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[132px] border-r border-[var(--border)] px-4 py-3 last:border-r-0">
      <div className="editorial-label text-[var(--muted)]">{label}</div>
      <div className="mt-1 font-serif text-[26px] leading-none tracking-[-0.04em]">{value}</div>
    </div>
  );
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
    <div className="border border-[var(--border)] bg-[var(--card-elevated)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="secondary">via {props.result.model === "kimi" ? "Kimi" : "DeepSeek"}</Badge>
        <div className="editorial-label text-[var(--muted)]">
          {(props.result.latencyMs / 1000).toFixed(1)}s
          {props.result.usage.totalTokens ? ` / ${props.result.usage.totalTokens} tokens` : ""}
        </div>
      </div>
      <div className="mt-3 text-[13px] leading-relaxed whitespace-pre-wrap">
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

const suggestions = [
  "Summarize this document in 3 bullet points",
  "What's the key takeaway?",
  "Are there any risks or warnings?",
  "Quote the most important paragraph",
];

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
  const citationCount = messages.reduce((total, message) => {
    const part = (message.parts ?? []).find((p) => p.type === "data-citations") as
      | { type: "data-citations"; data: CitationsPayload }
      | undefined;
    return total + (part?.data.chunks.length ?? 0);
  }, 0);

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
    <div className="flex h-full min-h-[680px] flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-[var(--border-strong)] bg-[var(--accent)]">
            <FileSearch className="h-5 w-5 text-[var(--black)]" />
          </div>
          <div>
            <div className="editorial-label text-[var(--muted)]">Q4 Research - PDF Workspace</div>
            <div className="mt-1 text-[13px] text-[var(--foreground)]">Kimi chat / DeepSeek retrieval / pgvector context</div>
          </div>
        </div>
        <div className="editorial-label flex items-center gap-2 text-[var(--foreground)]">
          <span className="h-2 w-2 bg-[var(--accent)]" aria-hidden="true" />
          Active
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-[var(--border)]">
        <MetricCell label="Documents" value={activeDocumentId ? "01" : "00"} />
        <MetricCell label="Chunks" value={compare?.chunks.length ? String(compare.chunks.length).padStart(2, "0") : "05"} />
        <MetricCell label="Answers" value={String(messages.filter((m) => m.role === "assistant").length).padStart(2, "0")} />
        <MetricCell label="Citations" value={String(citationCount || compare?.chunks.length || 0).padStart(2, "0")} />
        <div className="ml-auto flex min-w-[220px] items-center justify-end px-4 py-3">
          <ModelPicker />
        </div>
      </div>

      {(error || compareError) ? (
        <div className="border-b border-red-700/30 bg-red-100 px-4 py-3 text-sm text-red-900">
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

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.18)] lg:border-b-0 lg:border-r">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <div className="editorial-label text-[var(--muted)]">Retrieval feed</div>
          </div>
          <div className="space-y-3 p-4">
            <div className="border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="editorial-label text-[var(--muted)]">Selected doc</div>
              <div className="mt-2 text-[13px] leading-5">
                {activeDocumentId ? "Document ready for grounded questions." : "Upload and select a PDF to unlock chat."}
              </div>
            </div>
            <div className="border border-[var(--border)] bg-[var(--card-elevated)] p-3">
              <div className="editorial-label text-[var(--muted)]">Prompt starters</div>
              <div className="mt-3 flex flex-col gap-2">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-left text-[12px] leading-5 transition-colors duration-150 hover:border-[var(--black)] hover:bg-[rgba(0,0,0,0.04)]"
                    onClick={() => setInput(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            {compare ? (
              <div className="border border-[var(--border)] bg-[var(--accent-soft)] p-3">
                <div className="editorial-label text-[var(--muted)]">Retrieved chunks</div>
                <div className="mt-2 text-[13px]">{compare.chunks.length} chunks used for compare.</div>
              </div>
            ) : null}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col">
          <div
            className="min-h-0 flex-1 overflow-auto p-4"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {!activeDocumentId ? (
              <div className="flex h-full items-center justify-center border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
                Upload and select a document to start chatting.
              </div>
            ) : messages.length === 0 && !compare ? (
              <div className="grid h-full place-items-center border border-dashed border-[var(--border)] p-6">
                <div className="max-w-sm text-center">
                  <div className="editorial-label text-[var(--muted)]">Ready</div>
                  <div className="mt-3 font-serif text-[36px] leading-none tracking-[-0.05em]">Ask against the document.</div>
                  <p className="mt-4 text-[13px] leading-5 text-[var(--muted)]">
                    Answers are generated from retrieved page chunks and include citations when source markers are available.
                  </p>
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
                  <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="editorial-label text-[var(--muted)]">Model comparison</div>
                        <div className="mt-1 text-[13px] text-[var(--foreground)]">
                          {compareQuestion}
                        </div>
                      </div>
                      <Badge variant="outline">{compare.chunks.length} chunks</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
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
            <div className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--foreground)]">
              <span className="editorial-label inline-flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {compareLoading ? "Running Kimi and DeepSeek side by side..." : progress}
              </span>
            </div>
          ) : null}

          <form
            className="border-t border-[var(--border)]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!activeDocumentId) return;
              const trimmed = input.trim();
              if (!trimmed) return;
              void sendMessage({ text: trimmed });
              setInput("");
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto]">
              <input
                className="h-14 border-0 border-b border-[var(--border)] bg-[var(--surface)] px-4 text-[13px] outline-none placeholder:text-[var(--foreground-3)] focus:ring-2 focus:ring-inset focus:ring-[var(--black)] disabled:opacity-50 sm:border-b-0 sm:border-r"
                value={input}
                placeholder={activeDocumentId ? "Ask a question about this document..." : "Select a document first"}
                onChange={(e) => setInput(e.currentTarget.value)}
                disabled={disabled}
                aria-label="Message input"
              />
              <Button type="button" variant="outline" disabled={disabled || input.trim().length === 0} onClick={() => sendCompare(input)} aria-label="Compare both models" className="h-14 border-x-0 border-y-0 border-b border-[var(--border)] px-4 sm:border-b-0 sm:border-r">
                <Split className="h-4 w-4" />
                Compare
              </Button>
              <Button type="submit" disabled={disabled || input.trim().length === 0} aria-label="Send message" className="h-14 px-6">
                Send
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
