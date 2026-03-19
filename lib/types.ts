import z from "zod";

export const essaySchema = z.object({
  intro: z
    .string()
    .max(5000, "Paragraphs should be less than 500 characters long")
    .min(1, "Intro is required"),
  body1: z
    .string()
    .max(5000, "Paragraphs should be less than 500 characters long")
    .min(1, "Body 1 is required"),
  body2: z
    .string()
    .max(5000, "Paragraphs should be less than 500 characters long")
    .min(1, "Body 2 is required"),
  body3: z
    .string()
    .max(5000, "Paragraphs should be less than 500 characters long")
    .min(1, "Body 2 is required"),
  conc: z
    .string()
    .max(5000, "Paragraphs should be less than 500 characters long")
    .min(1, "Conclusion is required"),
});

export type TEssaySchema = z.infer<typeof essaySchema>;

export type IntroContext = {
  subjectA: string | null;
  subjectB: string | null;
  focus: "similarities" | "differences" | "both" | null;
  pointsOfComparison: string[];
};

export type SentenceSuccessResponse = {
  success: true;
  translated: string;
};

export type ParagraphCheck = {
  role: "intro" | "body" | "conclusion";
  scores: {
    structure: number;
    comparison: number;
    evidence_or_support: number;
    clarity_language: number;
  };
  feedback: {
    what_works: string[];
    fix_next: string[];
  };
  suggested_revision: string;
  updatedMemory: {
    thesis: string | null;
    comparePoints: string[] | null;
    paragraphSummary: string;
  };
};

export type EssayCheckResponse = {
  results: ParagraphCheck[];
};

export type AllFeedback = {
  content: {
    intro: string;
    body1: string;
    body2: string;
    body3: string;
    conc: string;
  };
  grammar: {
    intro: string;
    body1: string;
    body2: string;
    body3: string;
    conc: string;
  };
};
