import { sentenceSchema, TSentenceSchema } from "@/lib/types";
import { editFromClaude } from "@/ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: unknown = await request.json();

  const result = sentenceSchema.safeParse(body);
  let zodErrors = {};

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    return NextResponse.json(
      {
        success: false,
        errors: zodErrors,
      },
      { status: 400 },
    );
  }

  const data: TSentenceSchema = result.data;

  const literalSentence = await editFromClaude(data.intro);

  // translate
  return NextResponse.json(
    Object.keys(zodErrors).length > 0
      ? { errors: zodErrors }
      : {
          success: true,
          translated: literalSentence,
        },
  );
}
