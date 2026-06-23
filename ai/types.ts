import type { UIMessage } from "ai";

export type CitationsPayload = {
  document: { id: string; filename: string };
  model: "kimi" | "deepseek";
  /** Best retrieval similarity (0..1) — drives the confidence UI. */
  confidence: number;
  chunks: Array<{
    id: string;
    document_id: string;
    page: number | null;
    content: string;
    similarity: number;
  }>;
};

export type DocChatUIMessage = UIMessage<
  never,
  {
    citations: CitationsPayload;
  }
>;

