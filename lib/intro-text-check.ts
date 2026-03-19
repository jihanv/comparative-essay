import { NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { extractClaudeText } from "@/lib/claude-response";

type IntroTextCheckOptions = {
  req: Request;
  systemPrompt: string;
  responseKey: string;
  maxTokens?: number;
  userContentBuilder?: (intro: string) => string;
};

export async function handleIntroTextCheck({
  req,
  systemPrompt,
  responseKey,
  maxTokens = 800,
  userContentBuilder = (intro) => intro,
}: IntroTextCheckOptions) {
  const body = await req.json();
  const intro = body.intro;

  if (!intro || typeof intro !== "string") {
    return NextResponse.json(
      { error: "Missing intro paragraph" },
      { status: 400 },
    );
  }

  const anthropic = getAnthropicClient();
  //claude-haiku-4-5-20251001
  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: maxTokens,
    temperature: 0,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userContentBuilder(intro),
      },
    ],
  });

  const out = extractClaudeText(msg, { trim: false });

  return NextResponse.json({ [responseKey]: out });
}
