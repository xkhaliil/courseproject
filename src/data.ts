import { type Question } from "./types.ts"

export const question: Question = {
  kind: "choice",
  label: "How do you like your Sunday?",
  choices: [
    { label: "Cooking for friends", points: 3 },
    { label: "Reading with a blanket", points: 1 },
    { label: "A long walk", points: 2 },
  ],
}
