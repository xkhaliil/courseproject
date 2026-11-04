import { type FastifyPluginAsync } from "fastify"

const playPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get("/play", async () => {
    return {}
  })
}

export default playPlugin
