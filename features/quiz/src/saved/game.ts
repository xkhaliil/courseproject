import { isSubmission, type Submission } from "../play/index.ts"
import { readText } from "./read.ts"

export interface SavedGame {
  answers: Submission[]
}

export function loadSavedGame(saved: string): SavedGame {
  let value: unknown

  try {
    value = JSON.parse(saved)
  } catch {
    throw new Error("The saved game is not valid JSON")
  }

  if (!isSavedGame(value)) {
    throw new Error("The saved game does not have the shape of a saved game")
  }

  return value
}

export async function readSavedGame(file: string): Promise<SavedGame> {
  return loadSavedGame(await readText(file, "saved game"))
}

function isSavedGame(value: unknown): value is SavedGame {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return (
    "answers" in value &&
    Array.isArray(value.answers) &&
    value.answers.every(isSubmission)
  )
}
