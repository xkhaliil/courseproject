import { type Answer, type Choice } from "./types.ts"

export function isChoice(value: unknown): value is Choice {
  return (
    typeof value === "object" &&
    value !== null &&
    "label" in value &&
    typeof value.label === "string" &&
    "points" in value &&
    typeof value.points === "number"
  )
}

export function isAnswer(value: unknown): value is Answer {
  if (typeof value !== "object" || value === null || !("kind" in value)) {
    return false
  }

  if (value.kind === "choice") {
    return "picked" in value && isChoice(value.picked)
  }

  if (value.kind === "scale") {
    return "value" in value && typeof value.value === "number"
  }

  if (value.kind === "yesno") {
    return "value" in value && typeof value.value === "boolean"
  }

  return false
}
