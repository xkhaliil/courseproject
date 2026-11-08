//    It gets the quiz, starts a session, and for each prompt of the quiz waits for ask(app, prompt) and sends its submission to the session.
//    When it is done, it puts the text Thank you in app.

import {
  getQuiz,
  playAnswer,
  playResult,
  playStart,
} from "@platform/quiz/services"

import ask from "./ask/index.ts"

const app = document.getElementById("app")
if (!(app instanceof HTMLDivElement)) throw new Error("Cannot find app")

const quizName = "pasta"

const quiz = await getQuiz(quizName)
const session_id = await playStart(quiz.id)

for (const index in quiz.prompts) {
  const prompt = quiz.prompts[index]
  const submission = await ask(app, prompt)

  await playAnswer(session_id, submission)
}

const result = await playResult(session_id)

const title = document.createElement("h2")
title.textContent = result.title

const description = document.createElement("p")
description.textContent = result.description

app.replaceChildren(title, description)
