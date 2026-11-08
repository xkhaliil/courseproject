import { type Submission } from "@platform/quiz/play"
import { type FastifyPluginAsync } from "fastify"

import { toAnswer } from "./answer.ts"
import { createSession, getSession } from "./sessions.ts"
import { loadQuiz } from "@platform/quiz/quizzes"

interface SessionHeader {
  "x-session-id"?: string
}

interface StartBody {
  quiz?: string
}

const playPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: StartBody | undefined }>(
    "/play",
    async (request, reply) => {
      const name = request.body?.quiz
      if (typeof name !== "string") {
        return reply.code(400).send({ error: 'The body needs a "quiz" name' })
      }

      const quiz = await loadQuiz(name)
      if (!quiz) {
        return reply.code(404).send({ error: "There is no such quiz" })
      }

      return reply.code(201).send({
        session_id: createSession(quiz),
      })
    },
  )

  fastify.get<{ Headers: SessionHeader }>("/play", async (request, reply) => {
    const session = getSession(request.headers["x-session-id"])
    if (!session) {
      return reply.code(401).send({ error: "Unknown session" })
    }

    return {
      answered: session.answered,
      total: session.quiz.questions.length,
    }
  })

  fastify.post<{ Headers: SessionHeader; Body: Submission | undefined }>(
    "/play/answer",
    async (request, reply) => {
      const session = getSession(request.headers["x-session-id"])
      if (!session) {
        return reply.code(401).send({ error: "Unknown session" })
      }

      const question = session.quiz.questions[session.answered]
      if (!question) {
        return reply.code(409).send({ error: "Every question has an answer" })
      }

      const submission = request.body
      if (!submission || submission.kind !== question.kind) {
        return reply.code(400).send({ error: "That does not fit the question" })
      }

      const answer = toAnswer(question, submission)
      if (!answer) {
        return reply.code(400).send({ error: "That does not fit the question" })
      }

      session.state.record(question, answer)
      session.answered += 1

      return reply.code(200).send({})
    },
  )

  fastify.get<{ Headers: SessionHeader }>(
    "/play/result",
    async (request, reply) => {
      const session = getSession(request.headers["x-session-id"])
      if (!session) {
        return reply.code(401).send({ error: "Unknown session" })
      }

      if (session.answered < session.quiz.questions.length) {
        return reply.code(409).send({ error: "Some questions have no answer" })
      }

      if (!session.finished) {
        try {
          session.state.finish()
        } catch {
          return reply.code(409).send({ error: "No points have been scored" })
        }

        session.finished = true
      }

      const { title, description } = session.state.result()

      return {
        title,
        description,
      }
    },
  )
}

export default playPlugin
