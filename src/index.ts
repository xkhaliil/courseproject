// --- Types ---

interface Question {
  label: string
  choices: Array<{
    label: string
    points: number
  }>
}

// --- Data ---

const question: Question = {
  label: "How do you like your Sunday?",
  choices: [
    { label: "Cooking for friends", points: 3 },
    { label: "Reading with a blanket", points: 1 },
    { label: "A long walk", points: 2 },
  ],
}

const answer = 0

// --- Quiz ---

const choice = question.choices[answer]

console.log(`Question: ${question.label}`)
console.log(`Answer (${choice.points} points): ${choice.label}`)
