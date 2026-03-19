import { NextResponse } from "next/server";
import { INTRO_CONTEXT_PROMPT } from "@/lib/rubrics";
import { extractClaudeText, parseClaudeJson } from "@/lib/claude-response";
import { getAnthropicClient } from "@/lib/anthropic";

export async function POST(req: Request) {
  const body = await req.json();
  const intro = body.intro;

  if (!intro || typeof intro !== "string") {
    return NextResponse.json({ error: "Missing intro" }, { status: 400 });
  }

  const anthropic = getAnthropicClient();

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 700,
    system: INTRO_CONTEXT_PROMPT,
    temperature: 0,
    messages: [{ role: "user", content: intro }],
  });

  const raw = extractClaudeText(msg);

  let parsed;
  try {
    parsed = parseClaudeJson(raw);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from model", raw },
      { status: 500 },
    );
  }

  return NextResponse.json(parsed);
}
