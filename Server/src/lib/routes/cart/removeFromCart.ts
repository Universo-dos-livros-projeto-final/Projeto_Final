import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../register/authentication";

export async function removeFromCart(app: FastifyInstance) {
  app.delete("/cart/:bookId", { preHandler: [authenticate] }, async (request, reply) => {
    const schema = z.object({
      bookId: z.string().uuid(),
    });

    const { bookId } = schema.parse(request.params);
    const userId = request.user!.userId;

    await app.prisma.cartItem.deleteMany({
      where: { userId, bookId },
    });

    return reply.send({ message: "Livro removido do carrinho" });
  });
}
