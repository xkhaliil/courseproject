import { type Outcome, type Question } from "./types.ts"

export const outcomes: Outcome[] = [
  {
    id: "spaghetti",
    title: "Spaghetti",
    description: "Classic and dependable, you keep things simple.",
  },
  {
    id: "penne",
    title: "Penne",
    description: "Practical and direct, you get things done.",
  },
  {
    id: "farfalle",
    title: "Farfalle",
    description: "Playful and light, you like to go with the flow.",
  },
  {
    id: "ravioli",
    title: "Ravioli",
    description: "Full of surprises, you keep people guessing.",
  },
]

export const questions: Question[] = [
  {
    kind: "choice",
    label: "How do you like your Sunday?",
    choices: [
      { label: "Cooking for friends", outcome: "ravioli", points: 3 },
      { label: "Reading with a blanket", outcome: "spaghetti", points: 1 },
      { label: "A long walk", outcome: "penne", points: 2 },
    ],
  },
  {
    kind: "scale",
    label: "How much do you enjoy trying new things?",
    low: "not at all",
    high: "a lot",
    outcome: "farfalle",
  },
  {
    kind: "yesno",
    label: "Do you plan trips in advance?",
    outcome: "penne",
  },
]
