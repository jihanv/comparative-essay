import { NextResponse } from "next/server";
import { GRAMMAR_RUBRIC } from "@/lib/rubrics";
import { getAnthropicClient } from "@/lib/anthropic";
import { extractClaudeText } from "@/lib/claude-response";

export async function POST(req: Request) {
  const body = await req.json();
  const paragraph = body.paragraph;

  if (!paragraph || typeof paragraph !== "string") {
    return NextResponse.json({ error: "Missing paragraph" }, { status: 400 });
  }

  const anthropic = getAnthropicClient();

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1000,
    system: GRAMMAR_RUBRIC,
    messages: [{ role: "user", content: paragraph }],
    temperature: 0,
  });

  const out = extractClaudeText(msg);

  return NextResponse.json({ grammarFeedback: out });
}
