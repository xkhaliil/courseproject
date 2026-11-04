import { randomUUID } from "node:crypto"

import { type Quiz, PlayState } from "@platform/quiz/play"

interface Session {
  quiz: Quiz
  state: PlayState
  answered: number
  finished: boolean
}

const sessions = new Map<string, Session>()

export function createSession(quiz: Quiz): string {
  const state = new PlayState(quiz.outcomes)
  state.start()

  const id = randomUUID()

  sessions.set(id, {
    quiz,
    state,
    answered: 0,
    finished: false,
  })

  return id
}

export function getSession(id: string | undefined): Session | undefined {
  return id === undefined ? undefined : sessions.get(id)
}
