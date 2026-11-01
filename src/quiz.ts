import { type Answer, type Question } from "./types.ts"

export function show(question: Question): string {
  if (question.kind === "choice") {
    return `${question.label}\n${question.choices.map((choice, index) => `  ${index + 1}. ${choice.label}`).join("\n")}`
  }

  if (question.kind === "scale") {
    return `${question.label} (from ${question.low} to ${question.high})`
  }

  if (question.kind === "yesno") {
    return `${question.label} (yes or no)`
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
