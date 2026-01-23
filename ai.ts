import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = ``;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: false,
});

export async function editFromClaude(text: string) {
  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: ``,
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
