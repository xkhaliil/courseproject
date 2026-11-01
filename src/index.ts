import { question } from "./data.ts"

if (question.kind === "choice") {
  const answer = 0
  const choice = question.choices[answer]

  console.log(`Question: ${question.label}`)
  console.log(`Answer (${choice.points} points): ${choice.label}`)
}
