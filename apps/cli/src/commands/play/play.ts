import { type QuizResponse } from "@platform/quiz/play"

import ask from "./ask.ts"

export default async function play(
  name: string,
  options: { name?: string } = {},
) {
  if (options.name) {
    console.log(`Hello, ${options.name}`)
    console.log()
  }

  let quiz: QuizResponse
  try {
    const response = await fetch(`http://localhost:3000/quizzes/${name}`)
    quiz = (await response.json()) as QuizResponse
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }

  const startResponse = await fetch("http://localhost:3000/play", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      quiz: "pasta",
    }),
  })
  const { session_id } = await startResponse.json()

  for (const index in quiz.prompts) {
    const prompt = quiz.prompts[index]
    const submission = await ask(prompt)

    const answerResponse = await fetch("http://localhost:3000/play/answer", {
      method: "POST",
      headers: {
        "x-session-id": session_id,
        "content-type": "application/json",
      },
      body: JSON.stringify(submission),
    })

    if (!answerResponse.ok) {
      const error = await answerResponse.json()
      console.error(error)
    }
  }

  console.log()

  const answerResponse = await fetch("http://localhost:3000/play/result", {
    headers: {
      "x-session-id": session_id,
    },
  })
  const result = (await answerResponse.json()) as {
    title: string
    description: string
  }

  console.log(`You are: ${result.title}`)
  console.log(result.description)
  console.log()
}
