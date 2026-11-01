import { type Answer, type Question } from "./types.ts"

export function show(question: Question): string {
  const hint = question.hint ? `\nHint: ${question.hint}` : ""

  if (question.kind === "choice") {
    const choices = question.choices.map(
      (choice, index) => `  ${index + 1}. ${choice.label}`,
    )

    return `${question.label}\n${choices.join("\n")}${hint}`
  }

  if (question.kind === "scale") {
    return `${question.label} (from ${question.low} to ${question.high})${hint}`
  }

  if (question.kind === "yesno") {
    return `${question.label} (yes or no)${hint}`
  }

  throw new Error("Unknown kind.")
}

export function award(answer: Answer): number {
  if (answer.kind === "choice") {
    return answer.picked.points
  }

  if (answer.kind === "scale") {
    return answer.value
  }

  if (answer.kind === "yesno") {
    return answer.value ? 1 : 0
  }

  throw new Error("Unknown kind.")
}
