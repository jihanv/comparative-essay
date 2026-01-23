import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { INTRO_CONTEXT_PROMPT } from "@/lib/rubrics";

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
    max_tokens: 1000,
    system: INTRO_CONTEXT_PROMPT,
    messages: [{ role: "user", content: intro }],
  });

  const out = msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  let parsed;
  try {
    parsed = JSON.parse(out);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from model", raw: out },
      { status: 500 },
    );
  }

  return NextResponse.json(parsed);
}
