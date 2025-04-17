import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";

export async function deletePurchase(app: FastifyInstance) {
  app.delete(
    "/user/purchase/:purchaseId",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { purchaseId } = request.params as { purchaseId: string };
        const userId = request.user?.userId;

        if (!userId) {
          return reply.status(401).send({ message: "Unauthorized" });
        }

        const purchase = await app.prisma.purchase.findUnique({
          where: { id: purchaseId },
        });

        if (!purchase || purchase.userId !== userId) {
          return reply.status(404).send({ message: "Purchase not found or not owned by user" });
        }

        await app.prisma.purchase.delete({
          where: { id: purchaseId },
        });

        return reply.send({ message: "Purchase deleted successfully" });
      } catch (error) {
        console.error("Error deleting purchase:", error);
        return reply.status(500).send({ message: "Failed to delete purchase" });
      }
    }
  );
}