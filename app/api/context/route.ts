import { NextResponse } from "next/server";
import { INTRO_CONTEXT_PROMPT } from "@/lib/rubrics";
import { getClaudeModel } from "@/lib/langchain";
import { parseModelJson } from "@/lib/model-response";

export async function POST(req: Request) {
  const body = await req.json();
  const intro = body.intro;

  if (!intro || typeof intro !== "string") {
    return NextResponse.json({ error: "Missing intro" }, { status: 400 });
  }

  const model = getClaudeModel(700);

  const aiMsg = await model.invoke([
    { role: "system", content: INTRO_CONTEXT_PROMPT },
    { role: "user", content: intro },
  ]);

  const raw =
    typeof aiMsg.text === "string"
      ? aiMsg.text
      : typeof aiMsg.content === "string"
        ? aiMsg.content
        : "";

  let parsed;
  try {
    parsed = parseModelJson(raw);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from model", raw },
      { status: 500 },
    );
  }

  return NextResponse.json(parsed);
}
