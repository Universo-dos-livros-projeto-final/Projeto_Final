// validateToken.ts
import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function validateToken(app: FastifyInstance) {
  app.get("/validate-token", { preHandler: [authenticate] }, async (req, res) => {
    return res.send({ valid: true });
  });
}
