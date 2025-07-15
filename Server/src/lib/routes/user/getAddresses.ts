import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";

export async function getAddresses(app: FastifyInstance) {
  app.get(
    "/user/addresses",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

        const addresses = await app.prisma.address.findMany({
          where: { userId },
        });

        if (!addresses || addresses.length === 0) {
          return reply.status(404).send({ message: "No addresses found" });
        }

        reply.send({ addresses });
      } catch (error) {
        console.error("Error getting addresses:", error);
        reply.status(500).send({ message: "Error getting addresses" });
      }
    }
  );
}
