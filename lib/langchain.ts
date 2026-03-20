import { ChatAnthropic } from "@langchain/anthropic";

const modelCache = new Map<number, ChatAnthropic>();

export function getClaudeModel(maxTokens = 800) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const cached = modelCache.get(maxTokens);
  if (cached) {
    return cached;
  }

  const model = new ChatAnthropic({
    apiKey,
    model: "claude-haiku-4-5-20251001",
    temperature: 0,
    maxTokens,
    maxRetries: 2,
  });

  modelCache.set(maxTokens, model);
  return model;
}
