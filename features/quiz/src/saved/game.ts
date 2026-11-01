import { isAnswer, type Answer } from "../play/index.ts"

export interface SavedGame {
  answers: Answer[]
  startedAt?: string
}

export function loadSavedGame(saved: string): SavedGame {
  let value: unknown

  try {
    value = JSON.parse(saved)
  } catch {
    throw new Error("Invalid save file.")
  }

  if (!isSavedGame(value)) {
    throw new Error("Invalid save structure.")
  }

  return value
}

function isSavedGame(value: unknown): value is SavedGame {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (
    !("answers" in value) ||
    !Array.isArray(value.answers) ||
    !value.answers.every((answer) => isAnswer(answer))
  ) {
    return false
  }

  if ("startedAt" in value && typeof value.startedAt !== "string") {
    return false
  }

  return true
}
