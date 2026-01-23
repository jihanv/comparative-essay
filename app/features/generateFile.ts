import { AllFeedback } from "@/lib/types";
import { Document, Packer, Paragraph, TextRun } from "docx";

function linesToParagraphs(text: string) {
  return (text ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => new Paragraph({ children: [new TextRun(line)] }));
}

export async function downloadFeedbackDocx(
  all: AllFeedback,
  filename = "feedback.docx",
) {
  const contentBlock = [
    new Paragraph("CONTENT FEEDBACK"),
    new Paragraph(""),
    new Paragraph("Intro:"),
    ...linesToParagraphs(all.content.intro),
    new Paragraph(""),
    new Paragraph("Body 1:"),
    ...linesToParagraphs(all.content.body1),
    new Paragraph(""),
    new Paragraph("Body 2:"),
    ...linesToParagraphs(all.content.body2),
    new Paragraph(""),
    new Paragraph("Body 3:"),
    ...linesToParagraphs(all.content.body3),
    new Paragraph(""),
    new Paragraph("Conclusion:"),
    ...linesToParagraphs(all.content.conc),
  ];

  const grammarBlock = [
    new Paragraph(""),
    new Paragraph(""),
    new Paragraph("GRAMMAR FEEDBACK"),
    new Paragraph(""),
    new Paragraph("Intro:"),
    ...linesToParagraphs(all.grammar.intro),
    new Paragraph(""),
    new Paragraph("Body 1:"),
    ...linesToParagraphs(all.grammar.body1),
    new Paragraph(""),
    new Paragraph("Body 2:"),
    ...linesToParagraphs(all.grammar.body2),
    new Paragraph(""),
    new Paragraph("Body 3:"),
    ...linesToParagraphs(all.grammar.body3),
    new Paragraph(""),
    new Paragraph("Conclusion:"),
    ...linesToParagraphs(all.grammar.conc),
  ];

  const doc = new Document({
    sections: [{ children: [...contentBlock, ...grammarBlock] }],
  });

  const blob = await Packer.toBlob(doc);

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
