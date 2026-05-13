import { embed } from "ai";
import { embeddings } from "@/lib/providers";
import { getSupabaseAdmin } from "@/lib/supabase";

export type RetrievedChunk = {
  id: string;
  document_id: string;
  page: number | null;
  content: string;
  similarity: number;
};

export async function retrieveDocumentContext(args: {
  documentId: string;
  query: string;
  matchCount?: number;
}) {
  const embedModelId = process.env.EMBED_MODEL;
  if (!embedModelId) throw new Error("Missing EMBED_MODEL");

  const supabase = getSupabaseAdmin();

  const { data: docRow, error: docErr } = await supabase
    .from("documents")
    .select("id,filename")
    .eq("id", args.documentId)
    .maybeSingle();

  if (docErr) throw new Error(docErr.message);

  const { embedding } = await embed({
    model: embeddings.textEmbeddingModel(embedModelId),
    value: args.query,
  });

  const { data: matches, error: matchErr } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    match_count: args.matchCount ?? 5,
    doc_id: args.documentId,
  });

  if (matchErr) throw new Error(matchErr.message);

  return {
    document: {
      id: args.documentId,
      filename: docRow?.filename ?? "Uploaded document",
    },
    chunks: (matches ?? []) as RetrievedChunk[],
  };
}
