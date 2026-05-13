import type { Chunk } from "./types";

export function buildRagSystem(args: {
  docName: string;
  chunks: Array<Pick<Chunk, "id" | "page" | "content">>;
}) {
  const { docName, chunks } = args;

  const chunkBlock = chunks
    .map(
      (c) =>
        `[chunk_id: ${c.id}] (page ${c.page ?? "?"}) ${String(c.content ?? "").trim()}`,
    )
    .join("\n\n");

  return [
    `You are Aurora, an AI assistant for Aurora Labs.`,
    `You answer questions strictly from the provided document chunks.`,
    `You are technical, precise, neutral, and you cite sources.`,
    ``,
    `Rules:`,
    `- Answer ONLY from the chunks.`,
    `- If the chunks don't contain the answer, say: "I couldn't find this in the uploaded document."`,
    `- Cite each factual claim using [chunk_id: <uuid>] markers (use the chunk ids below).`,
    `- Never invent details not present in the chunks.`,
    `- If the user asks about something not covered, suggest uploading more docs or escalating to a human.`,
    ``,
    `Document: ${docName}`,
    ``,
    `## DOCUMENT CHUNKS`,
    chunkBlock || "(no chunks retrieved)",
  ].join("\n");
}

