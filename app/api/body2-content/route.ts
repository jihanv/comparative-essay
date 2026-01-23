import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { BODY2_CONTENT_RUBRIC } from "@/lib/rubrics";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();

  const paragraph = body.paragraph;
  const introContext = body.introContext;

  if (!paragraph || typeof paragraph !== "string") {
    return NextResponse.json({ error: "Missing paragraph" }, { status: 400 });
  }
  if (!introContext || typeof introContext !== "object") {
    return NextResponse.json(
      { error: "Missing introContext" },
      { status: 400 },
    );
  }

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 900,
    temperature: 0,
    system: BODY2_CONTENT_RUBRIC,
    messages: [
      {
        role: "user",
        content: JSON.stringify({
          introContext,
          paragraph,
        }),
      },
    ],
  });

  const out = msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return NextResponse.json({ body2StructureFeedback: out });
}
