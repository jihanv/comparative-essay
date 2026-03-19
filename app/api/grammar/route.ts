import { GRAMMAR_RUBRIC } from "@/lib/rubrics";
import { handleIntroTextCheck } from "@/lib/intro-text-check";

export async function POST(req: Request) {
  return handleIntroTextCheck({
    req,
    systemPrompt: GRAMMAR_RUBRIC,
    responseKey: "grammarFeedback",
    maxTokens: 700,
  });
}
