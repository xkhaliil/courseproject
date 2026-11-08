import { type Prompt, type Submission } from "@platform/quiz/play"

export interface Option {
  label: string
  submission: Submission
}

export function optionsFor(prompt: Prompt): Option[] {
  if (prompt.kind === "choice") {
    return prompt.choices.map((choice) => ({
      label: choice.label,
      submission: { kind: "choice", picked: choice },
    }))
  }

  if (prompt.kind === "scale") {
    return [1, 2, 3, 4, 5].map((value) => ({
      label: String(value),
      submission: { kind: "scale", value },
    }))
  }

  if (prompt.kind === "yesno") {
    return [
      { label: "Yes", submission: { kind: "yesno", value: true } },
      { label: "No", submission: { kind: "yesno", value: false } },
    ]
  }

  throw new Error("Unknown kind")
}
