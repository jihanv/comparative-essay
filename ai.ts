import { Anthropic } from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a perfectly bilingual translator fluent in both English and Japanese. You will be given English sentences written by EFL (English as a Foreign Language) learners. Your task is to translate these English sentences literally into Japanese without correcting any of the mistakes. Preserve all grammar errors, awkward phrasing, and unusual word choices. Do not fix or improve the English. Do not produce natural Japanese. Instead, reflect the structure and meaning of the original sentence as closely as possible, even if the result is unnatural or incorrect in Japanese.`;

const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function translateFromClaude(text: string) {
  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Look at the text: ${text}. Please translate it literally. Just return the translation`,
      },
    ],
  });
  const out = msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  if (!out) throw new Error("No text content returned by model");
  return out;
}
