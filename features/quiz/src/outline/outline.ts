import { type Question } from "../play/index.ts"

export type KindCounts = Record<Question["kind"], number>

export default function outline(quiz: Question[]): string[] {
  return quiz.map(
    (question, index) => `${index + 1}. ${question.label} (${kind(question)})`,
  )
}

export function countKinds(quiz: Question[]): KindCounts {
  const counts: KindCounts = { choice: 0, scale: 0, yesno: 0 }

  for (const question of quiz) {
    counts[question.kind] += 1
  }

  return counts
}

function kind(question: Question): string {
  if (question.kind === "choice") {
    const count = question.choices.length

    return `choice, ${count} ${count === 1 ? "option" : "options"}`
  }

  if (question.kind === "scale") {
    return "scale"
  }

  if (question.kind === "yesno") {
    return "yes or no"
  }

  throw new Error("Unknown kind.")
}
