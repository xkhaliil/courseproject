import { quiz } from "./data.ts"
import { loadSavedGame } from "./lib/load.ts"
import { show } from "./lib/quiz.ts"
import { Session } from "./lib/session.ts"
import { savedGame } from "./saved.ts"

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
