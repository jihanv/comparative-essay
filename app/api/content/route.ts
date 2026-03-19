import { INTRO_STRUCTURE_RUBRIC } from "@/lib/rubrics";
import { handleIntroTextCheck } from "@/lib/intro-text-check";

export async function POST(req: Request) {
  return handleIntroTextCheck({
    req,
    systemPrompt: INTRO_STRUCTURE_RUBRIC,
    responseKey: "structureFeedback",
    maxTokens: 800,
    userContentBuilder: (intro) =>
      `Here is the intro paragraph. Evaluate it using the rubric.\n\n${intro}`,
  });
}
