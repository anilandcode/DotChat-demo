import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const moonshot = createOpenAICompatible({
  name: "moonshot",
  baseURL: process.env.MOONSHOT_BASE_URL!,
  apiKey: process.env.MOONSHOT_API_KEY!,
});

export const deepseek = createOpenAICompatible({
  name: "deepseek",
  baseURL: process.env.DEEPSEEK_BASE_URL!,
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

export const embeddings = createOpenAICompatible({
  name: "embed",
  baseURL: process.env.EMBED_BASE_URL!,
  apiKey: process.env.EMBED_API_KEY!,
});

export type ModelChoice = "kimi" | "deepseek";

export function getChatModel(choice: ModelChoice) {
  return choice === "kimi"
    ? moonshot.chatModel(process.env.MOONSHOT_MODEL!)
    : deepseek.chatModel(process.env.DEEPSEEK_MODEL!);
}

