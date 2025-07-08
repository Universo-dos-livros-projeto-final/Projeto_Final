import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function getFavorites(app: FastifyInstance) {
  app.get("/favorites", { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user?.userId;
    if (!userId) return reply.status(401).send({ message: "Unauthorized" });

    const favorites = await app.prisma.favorite.findMany({
      where: { userId },
      include: { book: true },
    });

    return reply.send(favorites);
  });
}
