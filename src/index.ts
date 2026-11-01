import { outcomes, questions } from "./data.ts"
import { show } from "./quiz.ts"
import { Session } from "./session.ts"
import { type Answer } from "./types.ts"

const answers: Answer[] = [
  {
    kind: "choice",
    picked: { label: "A long walk", outcome: "penne", points: 2 },
  },
  { kind: "scale", value: 2 },
  { kind: "yesno", value: true },
]

const session = new Session(outcomes)

session.start()

for (const index in questions) {
  const question = questions[index]
  const answer = answers[index]

  const { outcome, points } = session.record(question, answer)

  console.log(show(question))
  console.log(`Answer worth ${points} points for ${outcome}`)
}

session.finish()

const result = session.result()

console.log(`You are: ${result.title}`)
console.log(result.description)
