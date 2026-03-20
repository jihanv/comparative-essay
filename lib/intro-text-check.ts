import { NextResponse } from "next/server";
import { getClaudeModel } from "@/lib/langchain";
import { extractModelText } from "@/lib/model-response";
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

  const model = getClaudeModel(maxTokens);

  const aiMsg = await model.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: userContentBuilder(intro) },
  ]);

  const out = extractModelText(aiMsg);

  return NextResponse.json({ [responseKey]: out });
}
