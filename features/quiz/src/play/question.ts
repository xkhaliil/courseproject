import type { Choice, PromptChoice } from "./choice.ts"

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
  low: string
  high: string
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
  low: string
  high: string
}

interface YesNoPrompt extends BaseQuestion {
  kind: "yesno"
}

export type Prompt = ChoicePrompt | ScalePrompt | YesNoPrompt

export function show(question: Question): string {
  const hint = question.hint ? `\nHint: ${question.hint}` : ""

  if (question.kind === "choice") {
    const choices = question.choices.map(
      (choice, index) => `  ${index + 1}. ${choice.label}`,
    )

    return `${question.label}\n${choices.join("\n")}${hint}`
  }

  if (question.kind === "scale") {
    return `${question.label} (1 = ${question.low}, 5 = ${question.high})${hint}`
  }

  if (question.kind === "yesno") {
    return `${question.label} (yes or no)${hint}`
  }

  throw new Error("Unknown kind")
}
