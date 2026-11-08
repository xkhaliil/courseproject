import {
  isAnswerResponse,
  isPlayStartResponse,
  isProgressResponse,
  isResultResponse,
  type ProgressResponse,
  type ResultResponse,
  type Submission,
} from "../play/index.ts"
import { apiRequest } from "./lib.ts"

export async function playStart(quiz: string): Promise<string> {
  const { session_id } = await apiRequest({
    path: "/play",
    method: "POST",
    body: { quiz },
    check: isPlayStartResponse,
  })

  return session_id
}

export async function playProgress(
  session_id: string,
): Promise<ProgressResponse> {
  return apiRequest({
    path: "/play",
    headers: { "x-session-id": session_id },
    check: isProgressResponse,
  })
}

export async function playAnswer(
  session_id: string,
  submission: Submission,
): Promise<void> {
  await apiRequest({
    path: "/play/answer",
    method: "POST",
    headers: { "x-session-id": session_id },
    body: submission,
    check: isAnswerResponse,
  })
}

export async function playResult(session_id: string): Promise<ResultResponse> {
  return apiRequest({
    path: "/play/result",
    headers: { "x-session-id": session_id },
    check: isResultResponse,
  })
}
