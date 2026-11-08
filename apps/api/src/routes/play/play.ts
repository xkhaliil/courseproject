import {
  isQuizId,
  isSubmission,
  type AnswerResponse,
  type ErrorResponse,
  type PlayStartResponse,
  type ProgressResponse,
  type ResultResponse,
  type Submission,
} from "@platform/quiz/play"
import { loadQuiz } from "@platform/quiz/quizzes"
import { type FastifyPluginAsync } from "fastify"

import { toAnswer } from "./answer.ts"
import { createSession, getSession } from "./sessions.ts"

interface SessionHeader {
  "x-session-id"?: string
}

interface StartBody {
  quiz?: string
}

const playPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: StartBody | undefined
    Reply: { 201: PlayStartResponse; "4xx": ErrorResponse }
  }>("/play", async (request, reply) => {
    const name = request.body?.quiz
    if (!isQuizId(name)) {
      return reply.code(400).send({ error: 'The body needs a "quiz" name' })
    }

    const quiz = await loadQuiz(name)
    if (!quiz) {
      return reply
        .code(404)
        .send({ error: `There is no quiz called "${name}"` })
    }

    return reply.code(201).send({
      session_id: createSession(quiz),
    })
  })

  fastify.get<{
    Headers: SessionHeader
    Reply: { 200: ProgressResponse; "4xx": ErrorResponse }
  }>("/play", async (request, reply) => {
    const session = getSession(request.headers["x-session-id"])
    if (!session) {
      return reply.code(401).send({ error: "Unknown session" })
    }

    return {
      answered: session.answered,
      total: session.quiz.questions.length,
    }
  })

  fastify.post<{
    Headers: SessionHeader
    Body: Submission | undefined
    Reply: { 200: AnswerResponse; "4xx": ErrorResponse }
  }>("/play/answer", async (request, reply) => {
    const session = getSession(request.headers["x-session-id"])
    if (!session) {
      return reply.code(401).send({ error: "Unknown session" })
    }

    const question = session.quiz.questions[session.answered]
    if (!question) {
      return reply.code(409).send({ error: "Every question has an answer" })
    }

    const submission = request.body
    if (!isSubmission(submission) || submission.kind !== question.kind) {
      return reply.code(400).send({ error: "That does not fit the question" })
    }

    const answer = toAnswer(question, submission)
    if (!answer) {
      return reply.code(400).send({ error: "That does not fit the question" })
    }

    session.state.record(question, answer)
    session.answered += 1

    return reply.code(200).send({})
  })

  fastify.get<{
    Headers: SessionHeader
    Reply: { 200: ResultResponse; "4xx": ErrorResponse }
  }>("/play/result", async (request, reply) => {
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
        session.finished = true
      } catch {
        return reply.code(409).send({ error: "No points have been scored" })
      }
    }

    const { title, description } = session.state.result()

    return {
      title,
      description,
    }
  })
}

export default playPlugin
