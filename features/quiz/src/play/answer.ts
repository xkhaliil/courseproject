import { isChoice, type Choice, type PromptChoice } from "./choice.ts"

interface ChoiceAnswer {
  kind: "choice"
  picked: Choice
}

interface ScaleAnswer {
  kind: "scale"
  value: number
}

interface YesNoAnswer {
  kind: "yesno"
  value: boolean
}

export type Answer = ChoiceAnswer | ScaleAnswer | YesNoAnswer

interface ChoiceSubmission {
  kind: "choice"
  picked: PromptChoice
}

interface ScaleSubmission {
  kind: "scale"
  value: number
}

interface YesNoSubmission {
  kind: "yesno"
  value: boolean
}

export type Submission = ChoiceSubmission | ScaleSubmission | YesNoSubmission

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
