import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../register/authentication";

export async function addToFavorites(app: FastifyInstance) {
  app.post("/favorites", { preHandler: [authenticate] }, async (request, reply) => {
    const schema = z.object({
      bookId: z.string().uuid(),
    });

    const { bookId } = schema.parse(request.body);
    const userId = request.user!.userId;

    const existing = await app.prisma.favorite.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (!existing) {
      await app.prisma.favorite.create({
        data: { userId, bookId },
      });
    }

    return reply.send({ message: "Livro adicionado aos favoritos" });
  });
}
