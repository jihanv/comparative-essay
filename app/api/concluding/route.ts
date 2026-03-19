import { CONC_CONTENT_RUBRIC } from "@/lib/rubrics";
import { handleParagraphContentCheck } from "@/lib/paragraph-content";

export async function POST(req: Request) {
  return handleParagraphContentCheck({
    req,
    systemPrompt: CONC_CONTENT_RUBRIC,
    responseKey: "concStructureFeedback",
    maxTokens: 500,
  });
}
