import {
  isChoice,
  isPromptChoice,
  type Choice,
  type PromptChoice,
} from "./choice.ts"

interface BaseQuestion {
  label: string
  hint?: string
}

interface ChoiceQuestion extends BaseQuestion {
  kind: "choice"
  choices: Choice[]
}

interface ScaleQuestion extends BaseQuestion {
  kind: "scale"
  min_label: string
  max_label: string
  min: number
  max: number
  outcome: string
}

interface YesNoQuestion extends BaseQuestion {
  kind: "yesno"
  outcome: string
}

export type Question = ChoiceQuestion | ScaleQuestion | YesNoQuestion

interface ChoicePrompt extends BaseQuestion {
  kind: "choice"
  choices: PromptChoice[]
}

interface ScalePrompt extends BaseQuestion {
  kind: "scale"
  min_label: string
  max_label: string
  min: number
  max: number
}

interface YesNoPrompt extends BaseQuestion {
  kind: "yesno"
}

export type Prompt = ChoicePrompt | ScalePrompt | YesNoPrompt

export function isQuestion(value: unknown): value is Question {
  if (!isBase(value)) {
    return false
  }

  if (value.kind === "choice") {
    return (
      "choices" in value &&
      Array.isArray(value.choices) &&
      value.choices.length > 0 &&
      value.choices.every(isChoice)
    )
  }

  if (value.kind === "scale") {
    return (
      isRange(value) && "outcome" in value && typeof value.outcome === "string"
    )
  }

  if (value.kind === "yesno") {
    return "outcome" in value && typeof value.outcome === "string"
  }

  return false
}

export function isPrompt(value: unknown): value is Prompt {
  if (!isBase(value)) {
    return false
  }

  if (value.kind === "choice") {
    return (
      "choices" in value &&
      Array.isArray(value.choices) &&
      value.choices.length > 0 &&
      value.choices.every(isPromptChoice)
    )
  }

  if (value.kind === "scale") {
    return isRange(value)
  }

  return value.kind === "yesno"
}

function isBase(value: unknown): value is BaseQuestion & { kind: unknown } {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("kind" in value) || !("label" in value)) {
    return false
  }

  if (typeof value.label !== "string") {
    return false
  }

  return (
    !("hint" in value) ||
    value.hint === undefined ||
    typeof value.hint === "string"
  )
}

function isRange(value: object): boolean {
  if (!("min" in value) || !("max" in value)) {
    return false
  }

  if (typeof value.min !== "number" || typeof value.max !== "number") {
    return false
  }

  if (
    !Number.isInteger(value.min) ||
    !Number.isInteger(value.max) ||
    value.min >= value.max
  ) {
    return false
  }

  return (
    "min_label" in value &&
    typeof value.min_label === "string" &&
    "max_label" in value &&
    typeof value.max_label === "string"
  )
}

export function show(question: Prompt): string {
  const hint = question.hint ? `\nHint: ${question.hint}` : ""

  if (question.kind === "choice") {
    const choices = question.choices.map(
      (choice, index) => `  ${index + 1}. ${choice.label}`,
    )

    return `${question.label}\n${choices.join("\n")}${hint}`
  }

  if (question.kind === "scale") {
    return `${question.label} (${question.min} = ${question.min_label}, ${question.max} = ${question.max_label})${hint}`
  }

  if (question.kind === "yesno") {
    return `${question.label} (yes or no)${hint}`
  }

  throw new Error("Unknown kind")
}
