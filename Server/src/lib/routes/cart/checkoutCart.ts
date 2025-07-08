import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function checkoutCart(app: FastifyInstance) {
  app.post("/cart/checkout", { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user?.userId;
    if (!userId) return reply.status(401).send({ message: "Unauthorized" });

    const cartItems = await app.prisma.cartItem.findMany({ where: { userId } });

    if (cartItems.length === 0) return reply.status(400).send({ message: "Cart is empty" });

    const purchases = await Promise.all(
      cartItems.map(item =>
        app.prisma.purchase.create({
          data: {
            userId,
            bookId: item.bookId,
            quantity: item.quantity,
          },    
        })
      )
    );

    await app.prisma.cartItem.deleteMany({ where: { userId } });

    return reply.send({ message: "Checkout completed", purchases });
  });
}
