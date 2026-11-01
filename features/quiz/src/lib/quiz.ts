import { type Question } from "./types.ts"

export function show(question: Question): string {
  const hint = question.hint ? `\nHint: ${question.hint}` : ""

  if (question.kind === "choice") {
    const choices = question.choices.map(
      (choice, index) => `  ${index + 1}. ${choice.label}`,
    )

    return `${question.label}\n${choices.join("\n")}${hint}`
  }

  if (question.kind === "scale") {
    return `${question.label} (1 = ${question.low}, 5 = ${question.high})${hint}`
  }

  if (question.kind === "yesno") {
    return `${question.label} (yes or no)${hint}`
  }

  throw new Error("Unknown kind")
}
