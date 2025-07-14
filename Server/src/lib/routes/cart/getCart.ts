  import { FastifyInstance } from "fastify";
  import { authenticate } from "../register/authentication";

  export async function getCart(app: FastifyInstance) {
    app.get("/cart", { preHandler: [authenticate] }, async (request, reply) => {
      const userId = request.user!.userId;

      const cartItems = await app.prisma.cartItem.findMany({
        where: { userId },
        include: { book: true },
      });

      return reply.send(cartItems);
    });
  }
