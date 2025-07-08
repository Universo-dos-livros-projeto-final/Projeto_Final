import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function getCart(app: FastifyInstance) {
  app.get("/cart", { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user?.userId;

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const cartItems = await app.prisma.cartItem.findMany({
      where: { userId },
      include: { book: true },
    });

    const formattedCart = cartItems.map((item) => ({
      id: item.book.id,
      title: item.book.title,
      image: item.book.bookphoto,
      price: item.book.price,
      quantity: item.quantity,
    }));

    return reply.send(formattedCart);
  });
}
