type ClaudeMessageLike = {
  content: ReadonlyArray<{
    type: string;
    text?: string;
  }>;
};

export function extractClaudeText(
  msg: ClaudeMessageLike,
  options: { trim?: boolean } = {},
) {
  const { trim = true } = options;

  const text = msg.content
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("");

  return trim ? text.trim() : text;
}

export function parseClaudeJson(raw: string) {
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
