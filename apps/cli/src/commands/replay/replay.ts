import path from "node:path"

import outline, { countKinds as kinds } from "@platform/quiz/outline"
import { recap, show } from "@platform/quiz/play"
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

  const counts = Object.entries(kinds(quiz.prompts))
    .map(([kind, count]) => `${kind} ${count}`)
    .join(", ")

  console.log("## Outline")
  console.log()
  console.log(outline(quiz.prompts).join("\n"))
  console.log()
  console.log(`Kinds: ${counts}`)
  console.log()

  console.log("## Questions")
  console.log()

  const session_id = await playStart(quiz.id)
  const review: string[] = []

  for (const [index, prompt] of quiz.prompts.entries()) {
    const submission = game.answers[index]
    review.push(recap(prompt, submission))

    console.log(show(prompt))
    console.log()

    await playAnswer(session_id, submission)
  }

  console.log("## Review")
  console.log()
  console.log(review.join("\n"))
  console.log()

  const result = await playResult(session_id)

  console.log("## Result")
  console.log()
  console.log(`You are: ${result.title}`)
  console.log(result.description)
}
