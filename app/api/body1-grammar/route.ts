import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { GRAMMAR_RUBRIC } from "@/lib/rubrics";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const paragraph = body.paragraph;

  if (!paragraph || typeof paragraph !== "string") {
    return NextResponse.json({ error: "Missing paragraph" }, { status: 400 });
  }

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500, // detailed grammar
    system: GRAMMAR_RUBRIC,
    messages: [{ role: "user", content: paragraph }],
    temperature: 0,
  });

  const out = msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return NextResponse.json({ body1GrammarFeedback: out });
}
