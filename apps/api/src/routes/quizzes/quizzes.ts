import { isQuizId, type QuizResponse } from "@platform/quiz/play"
import { listQuizzes, loadQuiz } from "@platform/quiz/quizzes"
import { type FastifyPluginAsync } from "fastify"

import { toPrompt } from "./prompt.ts"

const quizzesPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get("/quizzes", async () => {
    const quizzes = await listQuizzes()

    return {
      quizzes,
    }
  })

  fastify.get<{
    Params: { quizId: string }
    Reply: QuizResponse | { error: string }
  }>("/quizzes/:quizId", async (request, reply) => {
    const quizId = request.params.quizId
    if (!isQuizId(quizId)) {
      return reply.code(400).send({ error: 'The body needs a "quiz" name' })
    }

    const quiz = await loadQuiz(quizId)

    return {
      id: quizId,
      outcomes: quiz.outcomes,
      prompts: quiz.questions.map(toPrompt),
    }
  })
}

export default quizzesPlugin
