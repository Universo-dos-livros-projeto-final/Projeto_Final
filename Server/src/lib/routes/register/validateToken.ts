import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function validateToken(app: FastifyInstance) {
  app.get("/validate-token", { preHandler: [authenticate] }, async (request, reply) => {
    // Se chegou até aqui, o token é válido
    return reply.send({ 
      message: "Token válido",
      userId: request.user!.userId 
    });
  });
}
