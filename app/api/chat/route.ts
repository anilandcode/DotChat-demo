import { z } from "zod";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  embed,
  streamText,
  type UIMessage,
} from "ai";
import { embeddings, getChatModel, type ModelChoice } from "@/lib/providers";
import { getSupabaseAdmin } from "@/lib/supabase";
import { buildRagSystem } from "@/lib/system-prompt-rag";

export const runtime = "edge";

const BodySchema = z.object({
  messages: z.array(z.unknown()),
  documentId: z.string().min(1),
  model: z.enum(["kimi", "deepseek"]).default("deepseek"),
});

type RetrievedChunk = {
  id: string;
  document_id: string;
  page: number | null;
  content: string;
  similarity: number;
};

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.message }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { documentId, model } = parsed.data;
  const messages = parsed.data.messages as UIMessage[];
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return new Response(JSON.stringify({ error: "Missing user message" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const embedModelId = process.env.EMBED_MODEL;
  if (!embedModelId) {
    return new Response(JSON.stringify({ error: "Missing EMBED_MODEL" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const supabase = getSupabaseAdmin();

  const { data: docRow } = await supabase
    .from("documents")
    .select("id,filename")
    .eq("id", documentId)
    .maybeSingle();

  const lastUserText = (lastUser.parts ?? [])
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  const { embedding } = await embed({
    model: embeddings.textEmbeddingModel(embedModelId),
    value: lastUserText,
  });

  const { data: matches, error: matchErr } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    match_count: 5,
    doc_id: documentId,
  });

  if (matchErr) {
    return new Response(JSON.stringify({ error: matchErr.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const retrieved = (matches ?? []) as RetrievedChunk[];

  const system = buildRagSystem({
    docName: docRow?.filename ?? "Uploaded document",
    chunks: retrieved.map((c) => ({ id: c.id, page: c.page, content: c.content })),
  });

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({
        type: "data-citations",
        data: {
          document: { id: documentId, filename: docRow?.filename ?? "Uploaded document" },
          model: model as ModelChoice,
          chunks: retrieved.map((c) => ({
            id: c.id,
            document_id: c.document_id,
            page: c.page,
            content: c.content,
            similarity: c.similarity,
          })),
        },
      });

      const result = streamText({
        model: getChatModel(model as ModelChoice),
        system,
        messages: await convertToModelMessages(messages),
        maxOutputTokens: 1024,
        temperature: 0.3,
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}

