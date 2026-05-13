import { z } from "zod";
import { convertToModelMessages, generateText, type UIMessage } from "ai";
import { getChatModel, type ModelChoice } from "@/lib/providers";
import { retrieveDocumentContext } from "@/lib/retrieval";
import { buildRagSystem } from "@/lib/system-prompt-rag";

export const runtime = "edge";

const BodySchema = z.object({
  messages: z.array(z.unknown()),
  documentId: z.string().min(1),
});

async function runModel(args: {
  model: ModelChoice;
  system: string;
  messages: UIMessage[];
}) {
  const started = Date.now();
  const result = await generateText({
    model: getChatModel(args.model),
    system: args.system,
    messages: await convertToModelMessages(args.messages),
    maxOutputTokens: 1024,
    temperature: 0.3,
  });

  return {
    model: args.model,
    text: result.text,
    latencyMs: Date.now() - started,
    usage: {
      inputTokens: result.totalUsage.inputTokens ?? null,
      outputTokens: result.totalUsage.outputTokens ?? null,
      totalTokens: result.totalUsage.totalTokens ?? null,
    },
  };
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.message }, { status: 400 });
  }

  const messages = parsed.data.messages as UIMessage[];
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return Response.json({ error: "Missing user message" }, { status: 400 });
  }

  const query = (lastUser.parts ?? [])
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  const retrieval = await retrieveDocumentContext({
    documentId: parsed.data.documentId,
    query,
    matchCount: 5,
  }).catch((e) => e instanceof Error ? e : new Error("Retrieval failed"));

  if (retrieval instanceof Error) {
    return Response.json({ error: retrieval.message }, { status: 500 });
  }

  const system = buildRagSystem({
    docName: retrieval.document.filename,
    chunks: retrieval.chunks.map((c) => ({ id: c.id, page: c.page, content: c.content })),
  });

  const [deepseek, kimi] = await Promise.all([
    runModel({ model: "deepseek", system, messages }),
    runModel({ model: "kimi", system, messages }),
  ]);

  return Response.json({
    document: retrieval.document,
    chunks: retrieval.chunks,
    results: [deepseek, kimi],
  });
}
