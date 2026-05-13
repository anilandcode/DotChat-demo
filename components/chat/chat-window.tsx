"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModelPicker } from "@/components/chat/model-picker";
import { ChatMessage } from "@/components/chat/message";
import { useDocChatStore } from "@/lib/store";
import type { CitationsPayload, DocChatUIMessage } from "@/ai/types";

export function ChatWindow() {
  const activeDocumentId = useDocChatStore((s) => s.activeDocumentId);
  const model = useDocChatStore((s) => s.model);

  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
  } = useChat<DocChatUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { documentId: activeDocumentId, model },
    }),
  });

  const disabled = !activeDocumentId || status !== "ready";

  return (
    <Card className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium">Chat</div>
        <ModelPicker />
      </div>

      <div className="mt-4 flex-1 overflow-auto rounded-md border px-3 py-3" style={{ borderColor: "var(--border)" }}>
        {!activeDocumentId ? (
          <div className="h-full flex items-center justify-center text-sm" style={{ color: "var(--foreground-2)" }}>
            Upload a document and select it to start chatting.
          </div>
        ) : messages.length === 0 ? (
          <div className="space-y-2 text-sm" style={{ color: "var(--foreground-2)" }}>
            <div className="font-medium" style={{ color: "var(--foreground)" }}>Try asking:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Summarize this document in 3 bullet points</li>
              <li>What’s the key takeaway?</li>
              <li>Are there any risks or warnings?</li>
              <li>Quote the most important paragraph</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-3">
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
                  modelUsed={m.role === "assistant" ? model : undefined}
                  citations={m.role === "assistant" ? citationsPart?.data ?? null : null}
                />
              );
            })}
          </div>
        )}
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!activeDocumentId) return;
          const trimmed = input.trim();
          if (!trimmed) return;
          void sendMessage({ text: trimmed });
          setInput("");
        }}
      >
        <input
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border)", background: "var(--panel)" }}
          value={input}
          placeholder={activeDocumentId ? "Ask a question…" : "Select a document first"}
          onChange={(e) => setInput(e.currentTarget.value)}
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled || input.trim().length === 0}>
          Send
        </Button>
      </form>
    </Card>
  );
}

