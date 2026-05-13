import type { ModelChoice } from "./providers";

export type Document = {
  id: string;
  filename: string;
  size_bytes: number;
  pages: number | null;
  status: string | null;
  created_at: string;
};

export type Chunk = {
  id: string;
  document_id: string;
  page: number | null;
  chunk_index: number;
  content: string;
  similarity?: number;
};

export type Citation = {
  chunk_id: string;
  document_id: string;
  filename: string;
  page: number | null;
  snippet: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  model?: ModelChoice;
};

