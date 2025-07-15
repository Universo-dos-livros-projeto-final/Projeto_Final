import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";

interface AddressInput {
  street: string;
  number: string;
  zipcode: string;
  parish: string;
  county: string;
  state: string;
  country: string;
}

export async function addAddress(app: FastifyInstance) {
  app.post(
    "/user/address",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

        const {
          street,
          number,
          zipcode,
          parish,
          county,
          state,
          country,
        }: AddressInput = request.body as AddressInput;

        if (
          !street ||
          !number ||
          !zipcode ||
          !parish ||
          !county ||
          !state ||
          !country
        ) {
          return reply.status(400).send({ message: "Missing required address fields" });
        }

        const newAddress = await app.prisma.address.create({
          data: {
            street,
            number,
            zipcode,
            parish,
            county,
            state,
            country,
            userId,
          },
        });

        reply.send({
          message: "Address added successfully",
          address: newAddress,
        });
      } catch (error) {
        console.error("Error adding address:", error);
        reply.status(500).send({ message: "Error adding address" });
      }
    }
  );
}
