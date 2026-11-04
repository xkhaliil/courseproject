import { type Quiz, Session } from "@platform/quiz/play"
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

  const session = new Session(quiz.outcomes)

  session.start()

  for (const index in quiz.questions) {
    const question = quiz.questions[index]

    const answer = await ask(question)

    session.record(question, answer)
  }

  session.finish()
  console.log()

  const result = session.result()

  console.log(`You are: ${result.title}`)
  console.log(result.description)
  console.log()
}
