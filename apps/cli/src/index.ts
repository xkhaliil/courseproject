import { type Quiz, Session, show } from "@platform/quiz/play"
import { loadSavedGame } from "@platform/quiz/saved"

import { savedGame } from "./saved.ts"
import { loadQuiz } from "@platform/quiz/quizzes"

let quiz: Quiz
try {
  quiz = await loadQuiz("pasta")
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}

const session = new Session(quiz.outcomes)
const { answers } = loadSavedGame(savedGame)

session.start()

console.log("## Questions")
console.log()

for (const index in quiz.questions) {
  const question = quiz.questions[index]
  const answer = answers[index]

  const { outcome, points } = session.record(question, answer)

  console.log(show(question))
  console.log(`Your answer worth ${points} points for ${outcome}`)
  console.log()
}

session.finish()

console.log("## Result")
console.log()

const result = session.result()

console.log(`You are: ${result.title}`)
console.log(result.description)
console.log()
