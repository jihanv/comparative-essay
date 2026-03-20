import { ChatAnthropic } from "@langchain/anthropic";

let claudeModel: ChatAnthropic | null = null;

export function getClaudeModel() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  if (!claudeModel) {
    claudeModel = new ChatAnthropic({
      apiKey,
      model: "claude-haiku-4-5-20251001",
      temperature: 0,
      maxRetries: 2,
    });
  }

  return claudeModel;
}
