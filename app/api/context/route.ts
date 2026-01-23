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
    model: "claude-haiku-4-5-20251001",
    max_tokens: 700,
    system: INTRO_CONTEXT_PROMPT,
    temperature: 0,
    messages: [{ role: "user", content: intro }],
  });

  const raw = msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  // Remove ```json ... ``` if present
  const withoutFences = raw
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  // Fallback: extract the first {...} block if there is extra text
  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");
  const jsonString =
    start !== -1 && end !== -1 && end > start
      ? withoutFences.slice(start, end + 1)
      : withoutFences;

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from model", raw },
      { status: 500 },
    );
  }

  return NextResponse.json(parsed);
}
