export interface Quiz {
  outcomes: Outcome[]
  questions: Question[]
}

export interface Outcome {
  id: string
  title: string
  description: string
}

interface BaseQuestion {
  label: string
  hint?: string
}

interface ChoiceQuestion extends BaseQuestion {
  kind: "choice"
  choices: Choice[]
}

interface ScaleQuestion extends BaseQuestion {
  kind: "scale"
  low: string
  high: string
  outcome: string
}

interface YesNoQuestion extends BaseQuestion {
  kind: "yesno"
  outcome: string
}

export type Question = ChoiceQuestion | ScaleQuestion | YesNoQuestion

interface ChoiceAnswer {
  kind: "choice"
  picked: Choice
}

interface ScaleAnswer {
  kind: "scale"
  value: number
}

interface YesNoAnswer {
  kind: "yesno"
  value: boolean
}

export type Answer = ChoiceAnswer | ScaleAnswer | YesNoAnswer

export interface Choice {
  label: string
  outcome: string
  points: number
}

export interface Award {
  outcome: string
  points: number
}
