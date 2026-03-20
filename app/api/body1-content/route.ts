import { BODY1_CONTENT_RUBRIC } from "@/lib/rubrics";
import { handleParagraphContentCheck } from "@/lib/paragraph-content";

export async function POST(req: Request) {
  return handleParagraphContentCheck({
    req,
    systemPrompt: BODY1_CONTENT_RUBRIC,
    responseKey: "body1StructureFeedback",
    maxTokens: 600,
  });
}
