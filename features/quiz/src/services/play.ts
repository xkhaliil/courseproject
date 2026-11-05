import { type Submission } from "../play/answer.ts"
import { apiRequest } from "./lib.ts"

export interface PlayStartResponse {
  session_id: string
}

export async function playStart(quiz: string): Promise<string> {
  const { session_id } = await apiRequest<PlayStartResponse, { quiz: string }>({
    path: "/play",
    method: "POST",
    body: { quiz },
    headers: { "content-type": "application/json" },
  })

  return session_id
}

export async function playAnswer(
  session_id: string,
  submission: Submission,
): Promise<void> {
  await apiRequest<never, Submission>({
    path: "/play/answer",
    method: "POST",
    headers: { "x-session-id": session_id },
    body: submission,
  })
}

export async function playResult(session_id: string) {
  const result = await apiRequest<{
    title: string
    description: string
  }>({
    path: "/play/result",
    headers: {
      "x-session-id": session_id,
    },
  })

  return result
}
