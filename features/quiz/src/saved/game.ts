import { type Answer, isAnswer } from "../play/index.ts"

export interface SavedGame {
  answers: Answer[]
}

export function isSavedGame(value: unknown): value is SavedGame {
  return (
    typeof value === "object" &&
    value !== null &&
    "answers" in value &&
    Array.isArray(value.answers) &&
    value.answers.every(isAnswer)
  )
}

export function loadSavedGame(json: string): SavedGame {
  const value: unknown = JSON.parse(json)

  if (!isSavedGame(value)) {
    throw new Error("Invalid saved game.")
  }

  return value
}
