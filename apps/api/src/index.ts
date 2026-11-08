import cors from "@fastify/cors"
import { type ErrorResponse } from "@platform/quiz/play"
import Fastify, { type FastifyError } from "fastify"

import play from "./routes/play/index.ts"
import quizzes from "./routes/quizzes/index.ts"

const port = 3000

const fastify = Fastify()

// Every failure reaches the client as { error } with a message it can show.
fastify.setErrorHandler<FastifyError>((error, request, reply) => {
  const status = error.statusCode ?? 500
  if (status >= 500) {
    console.error(error)
  }

  return reply
    .code(status)
    .send({ error: error.message } satisfies ErrorResponse)
})

fastify.setNotFoundHandler((request, reply) => {
  return reply.code(404).send({
    error: `There is no route ${request.method} ${request.url}`,
  } satisfies ErrorResponse)
})

fastify.register(cors)
fastify.register(quizzes)
fastify.register(play)

try {
  await fastify.listen({ port })
  console.log(`The quiz API is listening on http://localhost:${port}`)
} catch (error) {
  console.error(
    `The quiz API cannot start: ${error instanceof Error ? error.message : error}`,
  )
  process.exit(1)
}
