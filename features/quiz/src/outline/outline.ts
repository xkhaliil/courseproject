import { type Prompt } from "../play/index.ts"

export type KindCounts = Record<Prompt["kind"], number>

// One line for each question: its number, its text, and its kind.
export default function outline(prompts: Prompt[]): string[] {
  return prompts.map(
    (prompt, index) =>
      `${index + 1}. ${prompt.label} (${describeKind(prompt)})`,
  )
}

export function countKinds(prompts: Prompt[]): KindCounts {
  const counts: KindCounts = { choice: 0, scale: 0, yesno: 0 }

  for (const prompt of prompts) {
    counts[prompt.kind] += 1
  }

  return counts
}

function describeKind(prompt: Prompt): string {
  if (prompt.kind === "choice") {
    const count = prompt.choices.length

    return `choice, ${count} ${count === 1 ? "option" : "options"}`
  }

  if (prompt.kind === "scale") {
    return `scale, ${prompt.min} to ${prompt.max}`
  }

  if (prompt.kind === "yesno") {
    return "yes or no"
  }

  throw new Error("Unknown kind")
}
