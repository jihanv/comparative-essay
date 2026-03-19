import { BODY2_CONTENT_RUBRIC } from "@/lib/rubrics";
import { handleParagraphContentCheck } from "@/lib/paragraph-content";

export async function POST(req: Request) {
  return handleParagraphContentCheck({
    req,
    systemPrompt: BODY2_CONTENT_RUBRIC,
    responseKey: "body2StructureFeedback",
    maxTokens: 1000,
  });
}
