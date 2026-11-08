import cors from "@fastify/cors"
import Fastify from "fastify"

import play from "./routes/play/index.ts"
import quizzes from "./routes/quizzes/index.ts"

const fastify = Fastify()

fastify.register(cors)
fastify.register(quizzes)
fastify.register(play)

await fastify.listen({ port: 3000 })
