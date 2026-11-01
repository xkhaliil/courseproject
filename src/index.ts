import { questions } from "./data.ts"
import { award, show } from "./quiz.ts"
import { type Answer } from "./types.ts"

const answers: Answer[] = [
  { kind: "choice", picked: { label: "A long walk", points: 2 } },
  { kind: "scale", value: 2 },
  { kind: "yesno", value: true },
]

let total = 0

for (const index in questions) {
  const question = questions[index]
  const answer = answers[index]

  const points = award(answer)
  total += points

  console.log(show(question))
  console.log(`Answer worth ${points} points`)
  console.log()
}

console.log(`Total ${total} points`)
