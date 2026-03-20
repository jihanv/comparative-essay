import { NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { extractClaudeText } from "@/lib/claude-response";

type ParagraphContentOptions = {
  req: Request;
  systemPrompt: string;
  responseKey: string;
  maxTokens?: number;
};

export async function handleParagraphContentCheck({
  req,
  systemPrompt,
  responseKey,
  maxTokens = 600,
}: ParagraphContentOptions) {
  const body = await req.json();
  const paragraph = body.paragraph;
  const introContext = body.introContext;

  if (!paragraph || typeof paragraph !== "string") {
    return NextResponse.json({ error: "Missing paragraph" }, { status: 400 });
  }

  if (!introContext) {
    return NextResponse.json(
      { error: "Missing introContext" },
      { status: 400 },
    );
  }

  const anthropic = getAnthropicClient();

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: maxTokens,
    temperature: 0,
    system: systemPrompt,
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

  const out = extractClaudeText(msg);

  return NextResponse.json({ [responseKey]: out });
}
