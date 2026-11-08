import { isPrompt, type Prompt } from "./question.ts"
import { isOutcome, type Outcome } from "./quiz.ts"

// The bodies the API replies with. The API types its routes with them, and the
// services check every reply against them before an app uses it.

export interface ErrorResponse {
  error: string
}

export interface QuizListResponse {
  quizzes: string[]
}

export interface QuizResponse {
  id: string
  outcomes: Outcome[]
  prompts: Prompt[]
}

export interface PlayStartResponse {
  session_id: string
}

export interface ProgressResponse {
  answered: number
  total: number
}

export type AnswerResponse = Record<string, never>

export type ResultResponse = Pick<Outcome, "title" | "description">

export function isErrorResponse(value: unknown): value is ErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return "error" in value && typeof value.error === "string"
}

export function isQuizResponse(value: unknown): value is QuizResponse {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("id" in value) || typeof value.id !== "string") {
    return false
  }

  if (!("outcomes" in value) || !Array.isArray(value.outcomes)) {
    return false
  }

  if (!("prompts" in value) || !Array.isArray(value.prompts)) {
    return false
  }

  return value.outcomes.every(isOutcome) && value.prompts.every(isPrompt)
}

export function isPlayStartResponse(
  value: unknown,
): value is PlayStartResponse {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return "session_id" in value && typeof value.session_id === "string"
}

export function isProgressResponse(value: unknown): value is ProgressResponse {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return (
    "answered" in value &&
    typeof value.answered === "number" &&
    "total" in value &&
    typeof value.total === "number"
  )
}

export function isAnswerResponse(value: unknown): value is AnswerResponse {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function isResultResponse(value: unknown): value is ResultResponse {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return (
    "title" in value &&
    typeof value.title === "string" &&
    "description" in value &&
    typeof value.description === "string"
  )
}
