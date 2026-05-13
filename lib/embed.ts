import { embedMany } from "ai";
import { embeddings } from "./providers";

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const modelId = process.env.EMBED_MODEL;
  if (!modelId) throw new Error("Missing EMBED_MODEL");

  const model = embeddings.textEmbeddingModel(modelId);
  const out: number[][] = [];

  const batchSize = 32;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const res = await embedMany({ model, values: batch });
    out.push(...res.embeddings);
  }

  return out;
}

