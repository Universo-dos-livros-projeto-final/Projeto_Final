import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";

export async function listUserPurchases(app: FastifyInstance) {
  app.get(
    "/user/purchases",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;

        if (!userId) {
          return reply.status(401).send({ message: "Unauthorized" });
        }

        const purchases = await app.prisma.purchase.findMany({
          where: { userId },
          include: {
            book: true,
          },
        });

        return reply.send(purchases);
      } catch (error) {
        console.error("Error fetching user purchases:", error);
        return reply.status(500).send({ message: "Failed to fetch purchases" });
      }
    }
  );
}

