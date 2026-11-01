import { type Answer, type Choice } from "./types.ts"

export interface SavedGame {
  answers: Answer[]
  startedAt?: string
}

export function loadSavedGame(cached: string): SavedGame {
  const parsed = JSON.parse(cached)

  if (!isSavedGame(parsed)) {
    throw new Error("Invalid save.")
  }

  return parsed
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

export function isAnswer(value: unknown): value is Answer {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("kind" in value) || typeof value.kind !== "string") {
    return false
  }

  if (value.kind === "choice") {
    return "picked" in value && isChoice(value.picked)
  }

  if (value.kind === "scale") {
    return (
      "value" in value &&
      typeof value.value === "number" &&
      value.value >= 1 &&
      value.value <= 5
    )
  }

  if (value.kind === "yesno") {
    return "value" in value && typeof value.value === "boolean"
  }

  return false
}

export function isChoice(value: unknown): value is Choice {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("label" in value) || typeof value.label !== "string") {
    return false
  }

  if (!("outcome" in value) || typeof value.outcome === "string") {
    return false
  }

  if (!("points" in value) || typeof value.points !== "number") {
    return false
  }

  return true
}
