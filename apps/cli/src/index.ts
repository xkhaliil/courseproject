import { questions } from "@platform/quiz/data"
import outline, { countKinds as kinds } from "@platform/quiz/outline"
import { award, show } from "@platform/quiz/play"
import { loadSavedGame } from "@platform/quiz/saved"

import { savedGame } from "./saved.ts"

const { answers } = loadSavedGame(savedGame)

console.log("## Outline")
console.log()

for (const line of outline(questions)) {
  console.log(line)
}

const counts = Object.entries(kinds(questions))
  .map(([kind, count]) => `${kind} ${count}`)
  .join(", ")

console.log()
console.log(`Kinds: ${counts}`)
console.log()

let total = 0

for (const [index, question] of questions.entries()) {
  const answer = answers[index]

  const points = award(answer)
  total += points

  console.log(show(question))
  console.log(`Answer worth ${points} points`)
  console.log()
}

console.log(`Total ${total} points`)
