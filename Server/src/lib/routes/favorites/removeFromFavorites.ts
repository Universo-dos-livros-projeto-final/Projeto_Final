import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function removeFromFavorites(app: FastifyInstance) {
  app.delete("/favorites/:bookId", { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user?.userId;
    const { bookId } = request.params as { bookId: string };

    const favorite = await app.prisma.favorite.findFirst({ where: { userId, bookId } });

    if (!favorite) return reply.status(404).send({ message: "Favorite not found" });

    await app.prisma.favorite.delete({ where: { id: favorite.id } });

    return reply.send({ message: "Book removed from favorites" });
  });
}
