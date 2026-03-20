import { NextResponse } from "next/server";
import { GRAMMAR_RUBRIC } from "@/lib/rubrics";
import { getChatModel } from "@/lib/langchain";

export async function POST(req: Request) {
  const body = await req.json();
  const paragraph = body.paragraph;

  if (!paragraph || typeof paragraph !== "string") {
    return NextResponse.json({ error: "Missing paragraph" }, { status: 400 });
  }

  const model = getChatModel(1000);

  const aiMsg = await model.invoke([
    { role: "system", content: GRAMMAR_RUBRIC },
    { role: "user", content: paragraph },
  ]);

  const out =
    typeof aiMsg.text === "string"
      ? aiMsg.text
      : typeof aiMsg.content === "string"
        ? aiMsg.content
        : "";

  return NextResponse.json({ grammarFeedback: out });
}
