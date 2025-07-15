import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";

interface AddressUpdateInput {
  street?: string;
  number?: string;
  zipcode?: string;
  parish?: string;
  county?: string;
  state?: string;
  country?: string;
}

interface UpdateAddressRequest {
  Params: { id: string };
  Body: AddressUpdateInput;
}

export async function updateAddress(app: FastifyInstance) {
  app.patch<UpdateAddressRequest>(
    "/user/address/:id",
    { preHandler: [authenticate] },
    async (request, reply) => {
      try {
        const userId = request.user?.userId;
        const addressId = request.params.id;
        const updateData = request.body;

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

        const address = await app.prisma.address.findUnique({
          where: { id: addressId },
        });

        if (!address || address.userId !== userId) {
          return reply.status(404).send({ message: "Address not found or unauthorized" });
        }

        const updatedAddress = await app.prisma.address.update({
          where: { id: addressId },
          data: updateData,
        });

        reply.send({ message: "Address updated successfully", address: updatedAddress });
      } catch (error) {
        console.error("Error updating address:", error);
        reply.status(500).send({ message: "Error updating address" });
      }
    }
  );
}
