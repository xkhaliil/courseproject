import { type Submission } from "./answer.ts"
import { type Prompt } from "./question.ts"

// One sentence about the answer to a question.
export function recap(prompt: Prompt, submission: Submission): string {
  if (prompt.kind !== submission.kind) {
    throw new Error(
      `A ${submission.kind} answer does not fit the ${prompt.kind} question "${prompt.label}"`,
    )
  }

  if (submission.kind === "choice") {
    return `${prompt.label} You chose ${submission.picked.label}.`
  }

  if (prompt.kind === "scale" && submission.kind === "scale") {
    return `${prompt.label} You rated it ${submission.value} out of ${prompt.max}.`
  }

  if (submission.kind === "yesno") {
    return `${prompt.label} You said ${submission.value ? "yes" : "no"}.`
  }

  throw new Error("Unknown kind")
}
