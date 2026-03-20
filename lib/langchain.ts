import { ChatAnthropic } from "@langchain/anthropic";
import { ChatDeepSeek } from "@langchain/deepseek";

type Provider = "claude" | "deepseek";

// Manual switch for testing.
// Later, you can change this to "deepseek" when you want to test DeepSeek.
const ACTIVE_PROVIDER: Provider = "deepseek";

const claudeModelCache = new Map<number, ChatAnthropic>();
const deepSeekModelCache = new Map<number, ChatDeepSeek>();

export function getClaudeModel(maxTokens = 800) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const cached = claudeModelCache.get(maxTokens);
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

  claudeModelCache.set(maxTokens, model);
  return model;
}

export function getDeepSeekModel(maxTokens = 1000) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY");
  }

  const cached = deepSeekModelCache.get(maxTokens);
  if (cached) {
    return cached;
  }

  const model = new ChatDeepSeek({
    apiKey,
    model: "deepseek-chat",
    temperature: 0,
    maxTokens,
    maxRetries: 2,
  });

  deepSeekModelCache.set(maxTokens, model);
  return model;
}

export function getChatModel(maxTokens = 800) {
  if (ACTIVE_PROVIDER === "deepseek") {
    return getDeepSeekModel(maxTokens);
  }

  return getClaudeModel(maxTokens);
}
