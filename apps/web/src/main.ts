import {
  getQuiz,
  playAnswer,
  playProgress,
  playResult,
  playStart,
} from "@platform/quiz/services"

import ask from "./ask/index.ts"

const quizName = "pasta"

const app = document.getElementById("app")
if (!(app instanceof HTMLDivElement)) throw new Error("Cannot find app")

// Plays the quiz through the API, one question at a time, then shows the result.
async function play(app: HTMLDivElement): Promise<void> {
  app.textContent = "Loading the quiz…"

  const quiz = await getQuiz(quizName)
  const session_id = await playStart(quiz.id)

  for (const prompt of quiz.prompts) {
    const { answered, total } = await playProgress(session_id)
    const submission = await ask(
      app,
      prompt,
      `Question ${answered + 1} of ${total}`,
    )

    await playAnswer(session_id, submission)
  }

  const result = await playResult(session_id)

  const title = document.createElement("h2")
  title.textContent = result.title

  const description = document.createElement("p")
  description.textContent = result.description

  app.replaceChildren(title, description)
}

try {
  await play(app)
} catch (error) {
  const message = document.createElement("p")
  message.setAttribute("role", "alert")
  message.textContent =
    error instanceof Error ? error.message : "Something went wrong"

  app.replaceChildren(message)
}
