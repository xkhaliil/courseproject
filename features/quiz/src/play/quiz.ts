import { type Answer } from "./answer.ts"
import { isQuestion, type Question } from "./question.ts"

export interface Quiz {
  outcomes: Outcome[]
  questions: Question[]
}

export interface Award {
  outcome: string
  points: number
}

export interface Outcome {
  id: string
  title: string
  description: string
}

export function isQuiz(value: unknown): value is Quiz {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (
    !("outcomes" in value) ||
    !Array.isArray(value.outcomes) ||
    value.outcomes.length === 0 ||
    !value.outcomes.every(isOutcome)
  ) {
    return false
  }

  if (
    !("questions" in value) ||
    !Array.isArray(value.questions) ||
    value.questions.length === 0 ||
    !value.questions.every(isQuestion)
  ) {
    return false
  }

  // Every outcome a question gives points to has to be one of the quiz's outcomes.
  const ids = new Set(value.outcomes.map((outcome) => outcome.id))

  return value.questions.every((question) =>
    outcomesOf(question).every((id) => ids.has(id)),
  )
}

function outcomesOf(question: Question): string[] {
  if (question.kind === "choice") {
    return question.choices.map((choice) => choice.outcome)
  }

  return [question.outcome]
}

export function isQuizId(value: unknown): value is string {
  if (typeof value !== "string") {
    return false
  }

  if (!value.match(/^[a-z0-9-]+$/i)) return false

  return true
}

export function isOutcome(value: unknown): value is Outcome {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return (
    "id" in value &&
    typeof value.id === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    "description" in value &&
    typeof value.description === "string"
  )
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
