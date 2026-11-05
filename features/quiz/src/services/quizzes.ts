import { type QuizResponse } from "../play/index.ts"
import { apiRequest } from "./lib.ts"

export async function getQuiz(name: string): Promise<QuizResponse> {
  const data = await apiRequest<QuizResponse>({ path: `/quizzes/${name}` })
  return data
}
