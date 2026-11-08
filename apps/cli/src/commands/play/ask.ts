import { confirm, input, select } from "@inquirer/prompts"
import { type Submission, type Prompt } from "@platform/quiz/play"

export default async function ask(prompt: Prompt): Promise<Submission> {
  const hint = prompt.hint ? `\nHint: ${prompt.hint}` : ""
  const message = `${prompt.label}${hint}`

  if (prompt.kind === "choice") {
    const picked = await select({
      message,
      choices: prompt.choices.map((choice) => ({
        name: choice.label,
        value: choice,
      })),
    })

    return { kind: "choice", picked }
  }

  if (prompt.kind === "scale") {
    const value = await input({
      message: `${message} (${prompt.min} = ${prompt.min_label}, ${prompt.max} = ${prompt.max_label})`,
      validate: (text) => {
        const number = Number(text)

        return Number.isInteger(number) &&
          number >= prompt.min &&
          number <= prompt.max
          ? true
          : `Enter a whole number from ${prompt.min} to ${prompt.max}`
      },
    })

    return { kind: "scale", value: Number(value) }
  }

  if (prompt.kind === "yesno") {
    const value = await confirm({ message })

    return { kind: "yesno", value }
  }

  throw new Error("Unknown kind")
}
