export function parseModelJson(raw: string) {
  const withoutFences = raw
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");
  const jsonString =
    start !== -1 && end !== -1 && end > start
      ? withoutFences.slice(start, end + 1)
      : withoutFences;

  return JSON.parse(jsonString);
}

export function extractModelText(aiMsg: { text?: unknown; content?: unknown }) {
  if (typeof aiMsg.text === "string") {
    return aiMsg.text;
  }

  if (typeof aiMsg.content === "string") {
    return aiMsg.content;
  }

  return "";
}
