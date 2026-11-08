import { type Prompt, type Question } from "@platform/quiz/play"

export function toPrompt(question: Question): Prompt {
  if (question.kind === "choice") {
    return {
      kind: "choice",
      label: question.label,
      hint: question.hint,
      choices: question.choices.map(({ label }) => ({ label })),
    }
  }

  if (question.kind === "scale") {
    return {
      kind: "scale",
      label: question.label,
      hint: question.hint,
      min_label: question.min_label,
      max_label: question.max_label,
      min: question.min,
      max: question.max,
    }
  }

  if (question.kind === "yesno") {
    return {
      kind: "yesno",
      label: question.label,
      hint: question.hint,
    }
  }

  throw new Error("Unknown kind")
}
