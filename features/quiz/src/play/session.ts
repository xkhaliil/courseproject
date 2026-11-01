import { award } from "./quiz.ts"
import {
  type Answer,
  type Award,
  type Outcome,
  type Question,
} from "./types.ts"

export type Status = "waiting" | "asking" | "done"

export class Session {
  private tally: Record<string, number> = {}

  private outcomes: Outcome[]
  private status: Status = "waiting"

  constructor(outcomes: Outcome[]) {
    this.outcomes = outcomes

    for (const outcome of outcomes) {
      this.tally[outcome.id] = 0
    }
  }

  public start(): void {
    if (this.status !== "waiting") {
      throw new Error("The quiz has already started")
    }

    this.status = "asking"
  }

  public record(question: Question, answer: Answer): Award {
    if (this.status !== "asking") {
      throw new Error("The quiz has not started")
    }

    const { outcome, points } = award(question, answer)
    if (!(outcome in this.tally)) {
      throw new Error(`Invalid outcome "${outcome}"`)
    }

    this.tally[outcome] += points

    return { outcome, points }
  }

  public finish(): void {
    if (this.status !== "asking") {
      throw new Error("The quiz is not asking questions")
    }

    if (!this.outcomes.some((outcome) => this.tally[outcome.id] > 0)) {
      throw new Error("No points have been scored")
    }

    this.status = "done"
  }

  public result(): Outcome {
    if (this.status !== "done") {
      throw new Error("The quiz has not finished")
    }

    let best = this.outcomes[0]

    for (const outcome of this.outcomes) {
      if (this.tally[outcome.id] > this.tally[best.id]) {
        best = outcome
      }
    }

    return best
  }
}
