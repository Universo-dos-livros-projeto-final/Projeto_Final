import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";

export async function deleteAddress(app: FastifyInstance) {
  app.delete(
    "/user/address/:addressId",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;
        const { addressId } = request.params as { addressId: string };

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

        const addressToDelete = await app.prisma.address.findUnique({
          where: { id: addressId },
        });

        if (!addressToDelete) {
          return reply.status(404).send({ message: "Address not found" });
        }

        if (addressToDelete.userId !== userId) {
          return reply.status(403).send({ message: "You are not authorized to delete this address" });
        }

        await app.prisma.address.delete({
          where: { id: addressId },
        });

        reply.send({ message: "Address deleted successfully" });
      } catch (error) {
        console.error("Error deleting address:", error);
        reply.status(500).send({ message: "Error deleting address" });
      }
    }
  );
}
