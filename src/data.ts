import { type Question } from "./types.ts"

export const questions: Question[] = [
  {
    kind: "choice",
    label: "How do you like your Sunday?",
    choices: [
      { label: "Cooking for friends", points: 3 },
      { label: "Reading with a blanket", points: 1 },
      { label: "A long walk", points: 2 },
    ],
  },
  {
    kind: "scale",
    label: "How much do you enjoy trying new things?",
    low: "not at all",
    high: "a lot",
  },
  {
    kind: "yesno",
    label: "Do you plan trips in advance?",
  },
]
