import {
  type Answer,
  type Question,
  type Submission,
} from "@platform/quiz/play"

export function toAnswer(
  question: Question,
  submission: Submission,
): Answer | undefined {
  if (question.kind === "choice" && submission.kind === "choice") {
    const picked = question.choices.find(
      ({ label }) => label === submission.picked?.label,
    )
    if (!picked) {
      return undefined
    }

    return {
      kind: "choice",
      picked,
    }
  }

  if (question.kind === "scale" && submission.kind === "scale") {
    const { value } = submission
    if (typeof value === "number" && value >= 1 && value <= 5) {
      return {
        kind: "scale",
        value,
      }
    }

    return undefined
  }

  if (question.kind === "yesno" && submission.kind === "yesno") {
    const { value } = submission
    if (typeof value !== "boolean") {
      return undefined
    }

    return {
      kind: "yesno",
      value,
    }
  }

  throw new Error("Unknown kind")
}
