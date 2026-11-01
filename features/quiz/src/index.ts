import { quiz } from "./data.ts"
import { loadSavedGame } from "./lib/load.ts"
import { show } from "./lib/quiz.ts"
import { Session } from "./lib/session.ts"
import { savedGame } from "./saved.ts"

const session = new Session(quiz.outcomes)
const saved = loadSavedGame(savedGame)

session.start()

for (const index in quiz.questions) {
  const question = quiz.questions[index]
  const answer = saved.answers[index]

  const { outcome, points } = session.record(question, answer)

  console.log(show(question))
  console.log(`Answer worth ${points} points for ${outcome}`)
}

session.finish()

const result = session.result()

console.log(`You are: ${result.title}`)
console.log(result.description)
