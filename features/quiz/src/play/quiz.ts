import { type Answer } from "./answer.ts"
import { type Prompt, type Question } from "./question.ts"

export interface Quiz {
  outcomes: Outcome[]
  questions: Question[]
}

export interface QuizResponse {
  id: string
  outcomes: Outcome[]
  prompts: Prompt[]
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

  // TODO: call isQuestion

  return true
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

  return true
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
