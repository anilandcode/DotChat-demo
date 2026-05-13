import { encoding_for_model } from "tiktoken";

export type TextChunk = {
  content: string;
  start_token: number;
  end_token: number;
};

function splitParagraphs(text: string) {
  return text
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter(Boolean);
}

function splitSentences(text: string) {
  // Simple heuristic; good enough for demo.
  return text
    .split(/(?<=[.!?])\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function chunkText(
  text: string,
  chunkTokens = 500,
  overlapTokens = 50,
): TextChunk[] {
  const enc = encoding_for_model("gpt-4o-mini"); // cl100k-ish; close enough for chunk sizing

  try {
    const cleaned = text.replace(/\r\n/g, "\n").trim();
    if (!cleaned) return [];

    const paras = splitParagraphs(cleaned);
    const pieces =
      paras.length > 1 ? paras : splitSentences(cleaned).length > 1 ? splitSentences(cleaned) : [cleaned];

    const chunks: TextChunk[] = [];
    let buf = "";
    let tokenCursor = 0;

    const flush = () => {
      const trimmed = buf.trim();
      if (!trimmed) return;
      const tokens = enc.encode(trimmed);
      const start = tokenCursor;
      const end = tokenCursor + tokens.length;
      chunks.push({ content: trimmed, start_token: start, end_token: end });
      tokenCursor = Math.max(0, end - overlapTokens);
      // Start next buffer with overlap by decoding tail tokens (approx)
      const overlap =
        overlapTokens > 0
          ? (tokens.slice(Math.max(0, tokens.length - overlapTokens)) as unknown as Uint32Array)
          : null;
      buf = overlap ? String(enc.decode(overlap)) : "";
    };

    for (const piece of pieces) {
      const next = buf ? `${buf}\n\n${piece}` : piece;
      const nextTokens = enc.encode(next).length;
      if (nextTokens <= chunkTokens) {
        buf = next;
        continue;
      }

      if (buf) flush();

      // Piece itself too large: hard-split by token count.
      const pieceTokens = enc.encode(piece);
      for (let i = 0; i < pieceTokens.length; i += chunkTokens - overlapTokens) {
        const window = pieceTokens.slice(i, i + chunkTokens) as unknown as Uint32Array;
        const content = String(enc.decode(window)).trim();
        if (!content) continue;
        const start = tokenCursor;
        const end = tokenCursor + window.length;
        chunks.push({ content, start_token: start, end_token: end });
        tokenCursor = Math.max(0, end - overlapTokens);
      }

      buf = "";
    }

    if (buf) flush();

    return chunks;
  } finally {
    enc.free();
  }
}

