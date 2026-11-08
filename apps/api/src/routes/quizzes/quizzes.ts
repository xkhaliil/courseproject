import {
  isQuizId,
  type ErrorResponse,
  type QuizListResponse,
  type QuizResponse,
} from "@platform/quiz/play"
import { listQuizzes, loadQuiz } from "@platform/quiz/quizzes"
import { type FastifyPluginAsync } from "fastify"

import { toPrompt } from "./prompt.ts"

const quizzesPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Reply: QuizListResponse }>("/quizzes", async () => {
    const quizzes = await listQuizzes()

    return {
      quizzes,
    }
  })

  fastify.get<{
    Params: { quizId: string }
    Reply: { 200: QuizResponse; "4xx": ErrorResponse }
  }>("/quizzes/:quizId", async (request, reply) => {
    const quizId = request.params.quizId
    if (!isQuizId(quizId)) {
      return reply
        .code(400)
        .send({ error: "A quiz name has only letters, numbers, and dashes" })
    }

    const quiz = await loadQuiz(quizId)
    if (!quiz) {
      return reply
        .code(404)
        .send({ error: `There is no quiz called "${quizId}"` })
    }

    return {
      id: quizId,
      outcomes: quiz.outcomes,
      prompts: quiz.questions.map(toPrompt),
    }
  })
}

export default quizzesPlugin
