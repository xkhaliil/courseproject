export interface Choice {
  label: string
  outcome: string
  points: number
}

export interface PromptChoice {
  label: string
}

export function isChoice(value: unknown): value is Choice {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("label" in value) || typeof value.label !== "string") {
    return false
  }

  if (!("outcome" in value) || typeof value.outcome !== "string") {
    return false
  }

  if (!("points" in value) || typeof value.points !== "number") {
    return false
  }

  return true
}
