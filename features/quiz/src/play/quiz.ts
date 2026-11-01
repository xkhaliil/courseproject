import { type Answer, type Award, type Question } from "./types.ts"

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

export function award(question: Question, answer: Answer): Award {
  if (question.kind !== answer.kind) {
    throw new Error("The answer does not match the question")
  }

  if (question.kind === "choice" && answer.kind === "choice") {
    return { outcome: answer.picked.outcome, points: answer.picked.points }
  }

  if (question.kind === "scale" && answer.kind === "scale") {
    return { outcome: question.outcome, points: answer.value }
  }

  if (question.kind === "yesno" && answer.kind === "yesno") {
    return { outcome: question.outcome, points: answer.value ? 1 : 0 }
  }

  throw new Error("Unknown kind")
}
