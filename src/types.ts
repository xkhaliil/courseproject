interface BaseQuestion {
  label: string
}

interface ChoiceQuestion extends BaseQuestion {
  kind: "choice"
  choices: Array<{
    label: string
    points: number
  }>
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
