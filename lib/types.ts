import z from "zod";

export const sentenceSchema = z.object({
  intro: z
    .string()
    .max(5000, "Paragraphs should be less than 500 characters long"),
  body1: z
    .string()
    .max(5000, "Paragraphs should be less than 500 characters long"),
  body2: z
    .string()
    .max(5000, "Paragraphs should be less than 500 characters long"),
  conc: z
    .string()
    .max(5000, "Paragraphs should be less than 500 characters long"),
});

export type TSentenceSchema = z.infer<typeof sentenceSchema>;

export type SentenceSuccessResponse = {
  success: true;
  translated: string;
};
