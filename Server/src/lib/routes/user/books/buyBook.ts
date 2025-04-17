import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../../register/authentication";

export async function buyBook(app: FastifyInstance) {
  app.post(
    "/book/:bookId/buy",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { bookId } = request.params as { bookId: string };
        const userId = request.user?.userId;
        const { quantity } = request.body as { quantity: number };

        if (!userId) {
          return reply.status(401).send({ message: "Unauthorized" });
        }

        const book = await app.prisma.book.findUnique({
          where: { id: bookId },
        });

        if (!book) {
          return reply.status(404).send({ message: "Book not found" });
        }

        const purchase = await app.prisma.purchase.create({
          data: {
            userId,
            bookId,
            quantity,
          },
        });

        return reply.send({ message: "Book purchased successfully", purchase });
      } catch (error) {
        console.error("Error purchasing book:", error);
        return reply.status(500).send({ message: "Failed to purchase book" });
      }
    }
  );
}
