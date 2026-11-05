import {
  getQuiz,
  playAnswer,
  playResult,
  playStart,
} from "@platform/quiz/services"

import ask from "./ask.ts"

export default async function play(
  name: string,
  options: { name?: string } = {},
) {
  if (options.name) {
    console.log(`Hello, ${options.name}`)
    console.log()
  }

  const quiz = await getQuiz(name)
  const session_id = await playStart(quiz.id)

  for (const index in quiz.prompts) {
    const prompt = quiz.prompts[index]
    const submission = await ask(prompt)

    await playAnswer(session_id, submission)
  }

  console.log()

  const result = await playResult(session_id)
  console.log(`You are: ${result.title}`)
  console.log(result.description)
  console.log()
}
