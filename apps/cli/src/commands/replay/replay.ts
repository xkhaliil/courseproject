import path from "node:path"

import { show, type Submission } from "@platform/quiz/play"
import { readSavedGame, readSettings } from "@platform/quiz/saved"
import {
  getQuiz,
  playAnswer,
  playResult,
  playStart,
} from "@platform/quiz/services"

const savedFolder = path.join(import.meta.dirname, "..", "..", "..", "saved")

export default async function replay(name: string): Promise<void> {
  const settings = await readSettings(path.join(savedFolder, "settings.json"))
  const game = await readSavedGame(path.join(savedFolder, "game.json"))

  const quiz = await getQuiz(name)
  if (game.answers.length !== quiz.prompts.length) {
    throw new Error(
      `The saved game has ${game.answers.length} answers, but the quiz "${quiz.id}" has ${quiz.prompts.length} questions`,
    )
  }

  console.log(`Welcome back, ${settings.name}`)
  console.log()

  const session_id = await playStart(quiz.id)

  for (const [index, prompt] of quiz.prompts.entries()) {
    const submission = game.answers[index]
    if (submission.kind !== prompt.kind) {
      throw new Error(
        `Saved answer ${index + 1} is a ${submission.kind} answer, but question ${index + 1} is a ${prompt.kind} question`,
      )
    }

    console.log(show(prompt))
    console.log(`Saved answer: ${describe(submission)}`)
    console.log()

    await playAnswer(session_id, submission)
  }

  const result = await playResult(session_id)
  console.log(`You are: ${result.title}`)
  console.log(result.description)
  console.log()
}

function describe(submission: Submission): string {
  if (submission.kind === "choice") {
    return submission.picked.label
  }

  if (submission.kind === "scale") {
    return `${submission.value}`
  }

  return submission.value ? "yes" : "no"
}
