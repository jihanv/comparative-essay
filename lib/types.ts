import z from "zod";

export const sentenceSchema = z.object({
  sentence: z
    .string()
    .max(500, "Paragraphs should be less than 500 characters long"),
});

export type TSentenceSchema = z.infer<typeof sentenceSchema>;

export type SentenceSuccessResponse = {
  success: true;
  translated: string;
};
