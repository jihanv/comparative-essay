import { NextResponse } from "next/server";
import { z } from "zod";
import { INTRO_CONTEXT_PROMPT } from "@/lib/rubrics";
import { getChatModel } from "@/lib/langchain";

const IntroContextSchema = z.object({
  subjectA: z.string().nullable(),
  subjectB: z.string().nullable(),
  focus: z.enum(["similarities", "differences", "both"]).nullable(),
  pointsOfComparison: z.array(z.string()),
});

export async function POST(req: Request) {
  const body = await req.json();
  const intro = body.intro;

  if (!intro || typeof intro !== "string") {
    return NextResponse.json({ error: "Missing intro" }, { status: 400 });
  }

  try {
    const model = getChatModel(700);
    const structuredModel = model.withStructuredOutput(IntroContextSchema);

    const parsed = await structuredModel.invoke([
      { role: "system", content: INTRO_CONTEXT_PROMPT },
      { role: "user", content: intro },
    ]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("/api/context structured output failed:", error);

    return NextResponse.json(
      { error: "Invalid structured output from model" },
      { status: 500 },
    );
  }
}
