import { z } from "zod";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { getChatModel, type ModelChoice } from "@/lib/providers";
import { buildRagSystem } from "@/lib/system-prompt-rag";
import { retrieveDocumentContext } from "@/lib/retrieval";

export const runtime = "edge";

const BodySchema = z.object({
  messages: z.array(z.unknown()),
  documentId: z.string().min(1),
  model: z.enum(["kimi", "deepseek"]).default("kimi"),
});

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

  const lastUserText = (lastUser.parts ?? [])
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  const retrieval = await retrieveDocumentContext({
    documentId,
    query: lastUserText,
    matchCount: 5,
  }).catch((e) => e instanceof Error ? e : new Error("Retrieval failed"));

  if (retrieval instanceof Error) {
    return new Response(JSON.stringify({ error: retrieval.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const system = buildRagSystem({
    docName: retrieval.document.filename,
    chunks: retrieval.chunks.map((c) => ({ id: c.id, page: c.page, content: c.content })),
  });

  // Retrieval confidence = best chunk similarity. Surfaced in the UI so a weak
  // match is shown as "low confidence" rather than answered with false certainty.
  const confidence = retrieval.chunks.length
    ? Math.max(...retrieval.chunks.map((c) => c.similarity ?? 0))
    : 0;

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({
        type: "data-citations",
        data: {
          document: retrieval.document,
          model: model as ModelChoice,
          confidence: Number(confidence.toFixed(3)),
          chunks: retrieval.chunks.map((c) => ({
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
