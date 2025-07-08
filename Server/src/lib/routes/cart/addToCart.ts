import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function addToCart(app: FastifyInstance) {
  app.post("/cart", { preHandler: [authenticate] }, async (request, reply) => {
    const { bookId, quantity } = request.body as { bookId: string, quantity: number };
    const userId = request.user?.userId;

    if (!userId) return reply.status(401).send({ message: "Unauthorized" });

    const book = await app.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return reply.status(404).send({ message: "Book not found" });

    const existing = await app.prisma.cartItem.findFirst({
      where: { userId, bookId },
    });

    const cartItem = existing
      ? await app.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
        })
      : await app.prisma.cartItem.create({
          data: { userId, bookId, quantity },
        });

    return reply.send({ message: "Item added to cart", cartItem });
  });
}

