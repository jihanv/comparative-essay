# Comparative Essay Checker

A small **Next.js (App Router)** web app for checking **comparative essays** (aimed at **Japanese EFL learners**). It sends essay paragraphs to **Anthropic Claude** along with detailed rubrics (mostly written in Japanese) and returns **structure/content feedback** (and has rubric scaffolding for grammar + additional paragraphs). It also includes a helper to **export feedback to a `.docx`** file.

> UI entrypoint renders a simple page with a background image, header, and a text input component.

---

## Features

- **Intro paragraph structure evaluation** using a rubric prompt (no grammar/spelling critique in this mode).
- Rubric library includes prompts for:
  - Intro structure
  - Intro grammar checks
  - Intro context extraction (JSON)
  - Body paragraphs 1–3 (content/structure)
  - Conclusion paragraph (content/structure)
- **Zod schema** for validating an essay with 5 sections: intro, body1, body2, body3, conclusion.
- **Export feedback to Word (`.docx`)** via the `docx` package (client-side download).

---

## Tech stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic SDK** (`@anthropic-ai/sdk`)
- **Zod** for validation
- **docx** for Word document export
- `clsx` + `tailwind-merge` utility (`cn()`)

---

## Getting started

### 1) Install dependencies

Use your preferred package manager:

```bash
npm install
# or
pnpm install
# or
yarn
```
