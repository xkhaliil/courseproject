import { type Answer } from "@platform/quiz/play"

const initialAnswers: Answer[] = [
  {
    kind: "choice",
    picked: { label: "A long walk", outcome: "penne", points: 2 },
  },
  { kind: "scale", value: 2 },
  { kind: "yesno", value: true },
]

export const savedGame = JSON.stringify({
  answers: initialAnswers,
  startedAt: new Date(),
})
