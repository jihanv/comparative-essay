import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { INTRO_GRAMMAR_RUBRIC } from "@/lib/rubrics";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const intro = body.intro;

  if (!intro || typeof intro !== "string") {
    return NextResponse.json({ error: "Missing intro" }, { status: 400 });
  }

  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 2000,
    system: INTRO_GRAMMAR_RUBRIC,
    messages: [{ role: "user", content: intro }],
  });

  const out = msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  return NextResponse.json({ grammarFeedback: out });
}
