import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { INTRO_STRUCTURE_RUBRIC } from "@/lib/rubrics";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();

  const intro = body.intro;

  // Check if rubric exists
  if (!intro || typeof intro !== "string") {
    return NextResponse.json(
      { error: "Missing intro paragraph" },
      { status: 400 },
    );
  }

  //Send Rubric to claude
  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 800,
    system: INTRO_STRUCTURE_RUBRIC,
    messages: [
      {
        role: "user",
        content: `Here is the intro paragraph. Evaluate it using the rubric.\n\n${intro}`,
      },
    ],
  });

  const out = msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  return NextResponse.json({ structureFeedback: out });
}

// export async function POST(request: Request) {
//   const body: unknown = await request.json();

//   const result = essaySchema.safeParse(body);
//   let zodErrors = {};

//   if (!result.success) {
//     result.error.issues.forEach((issue) => {
//       zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
//     });
//     return NextResponse.json(
//       {
//         success: false,
//         errors: zodErrors,
//       },
//       { status: 400 },
//     );
//   }

//   const data: TEssaySchema = result.data;

//   const literalSentence = await editFromClaude(data.intro);

//   // translate
//   return NextResponse.json(
//     Object.keys(zodErrors).length > 0
//       ? { errors: zodErrors }
//       : {
//           success: true,
//           translated: literalSentence,
//         },
//   );
// }
