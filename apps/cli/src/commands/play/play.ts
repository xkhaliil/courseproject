import { type Quiz, PlayState } from "@platform/quiz/play"
import { loadQuiz } from "@platform/quiz/quizzes"

import ask from "./ask.ts"

export default async function play(
  name: string,
  options: { name?: string } = {},
) {
  if (options.name) {
    console.log(`Hello, ${options.name}`)
    console.log()
  }

  let quiz: Quiz
  try {
    quiz = await loadQuiz(name)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }

  const state = new PlayState(quiz.outcomes)

  state.start()

  for (const index in quiz.questions) {
    const question = quiz.questions[index]

    const answer = await ask(question)

    state.record(question, answer)
  }

  state.finish()
  console.log()

  const result = state.result()

  console.log(`You are: ${result.title}`)
  console.log(result.description)
  console.log()
}
