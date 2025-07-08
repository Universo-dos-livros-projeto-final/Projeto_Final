import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function removeFromCart(app: FastifyInstance) {
  app.delete("/cart/:bookId", { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user?.userId;
    const { bookId } = request.params as { bookId: string };

    const cartItem = await app.prisma.cartItem.findFirst({
      where: { userId, bookId },
    });

    if (!cartItem) return reply.status(404).send({ message: "Item not found in cart" });

    await app.prisma.cartItem.delete({ where: { id: cartItem.id } });

    return reply.send({ message: "Item removed from cart" });
  });
}
