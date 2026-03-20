import { BODY3_CONTENT_RUBRIC } from "@/lib/rubrics";
import { handleParagraphContentCheck } from "@/lib/paragraph-content";

export async function POST(req: Request) {
  return handleParagraphContentCheck({
    req,
    systemPrompt: BODY3_CONTENT_RUBRIC,
    responseKey: "body3StructureFeedback",
    maxTokens: 600,
  });
}
