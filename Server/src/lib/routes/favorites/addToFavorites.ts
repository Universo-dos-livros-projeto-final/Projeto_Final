import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function addToFavorites(app: FastifyInstance) {
  app.post("/favorites", { preHandler: [authenticate] }, async (request, reply) => {
    const { bookId } = request.body as { bookId: string };
    const userId = request.user?.userId;

    if (!userId) return reply.status(401).send({ message: "Unauthorized" });

    const book = await app.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return reply.status(404).send({ message: "Book not found" });

    const existing = await app.prisma.favorite.findFirst({ where: { userId, bookId } });
    if (existing) return reply.status(400).send({ message: "Book already favorited" });

    const favorite = await app.prisma.favorite.create({ data: { userId, bookId } });

    return reply.send({ message: "Book added to favorites", favorite });
  });
}
