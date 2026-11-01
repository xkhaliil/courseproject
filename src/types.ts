interface BaseQuestion {
  label: string
}

interface Choice {
  label: string
  points: number
}

interface ChoiceQuestion extends BaseQuestion {
  kind: "choice"
  choices: Choice[]
}

interface ScaleQuestion extends BaseQuestion {
  kind: "scale"
  low: string
  high: string
}

interface YesNoQuestion extends BaseQuestion {
  kind: "yesno"
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
