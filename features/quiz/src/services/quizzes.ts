import { isQuizResponse, type QuizResponse } from "../play/index.ts"
import { apiRequest } from "./lib.ts"

export async function getQuiz(name: string): Promise<QuizResponse> {
  return apiRequest({
    path: `/quizzes/${encodeURIComponent(name)}`,
    check: isQuizResponse,
  })
}
