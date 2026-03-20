import { NextResponse } from "next/server";
import { getChatModel } from "@/lib/langchain";

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

  if (
    !introContext ||
    typeof introContext !== "object" ||
    Array.isArray(introContext)
  ) {
    return NextResponse.json(
      { error: "Invalid introContext" },
      { status: 400 },
    );
  }

  const model = getChatModel(maxTokens);

  const aiMsg = await model.invoke([
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: JSON.stringify({
        introContext,
        paragraph,
      }),
    },
  ]);

  const out =
    typeof aiMsg.text === "string"
      ? aiMsg.text
      : typeof aiMsg.content === "string"
        ? aiMsg.content
        : "";

  return NextResponse.json({ [responseKey]: out });
}
