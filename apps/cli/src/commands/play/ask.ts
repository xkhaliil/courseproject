import { confirm, input, select } from "@inquirer/prompts"
import { type Answer, type Question } from "@platform/quiz/play"

export default async function ask(question: Question): Promise<Answer> {
  const hint = question.hint ? `\nHint: ${question.hint}` : ""
  const message = `${question.label}${hint}`

  if (question.kind === "choice") {
    const picked = await select({
      message,
      choices: question.choices.map((choice) => ({
        name: choice.label,
        value: choice,
      })),
    })

    return { kind: "choice", picked }
  }

  if (question.kind === "scale") {
    const value = await input({
      message: `${message} (1 = ${question.low}, 5 = ${question.high})`,
      validate: (text) => {
        const number = Number(text)

        return Number.isInteger(number) && number >= 1 && number <= 5
          ? true
          : "Enter a whole number from 1 to 5"
      },
    })

    return { kind: "scale", value: Number(value) }
  }

  if (question.kind === "yesno") {
    const value = await confirm({ message })

    return { kind: "yesno", value }
  }

  throw new Error("Unknown kind")
}
