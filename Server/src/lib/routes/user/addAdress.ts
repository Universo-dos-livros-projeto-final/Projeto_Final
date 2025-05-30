import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";

interface AdressInput {
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

export async function addAdress(app: FastifyInstance) {
  app.post(
    "/user/adress",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

        const { street, city, state, zipcode }: AdressInput =
          request.body as AdressInput;

        if (!street || !city || !state || !zipcode) {
          return reply
            .status(400)
            .send({ message: "Missing required adress fields" });
        }

        const newAdress = await app.prisma.adress.create({
          data: {
            street,
            city,
            state,
            zipcode,
            userId,
          },
        });

        reply.send({
          message: "Adress added successfully",
          address: newAdress,
        });
      } catch (error) {
        console.error("Error adding adress:", error);
        reply.status(500).send({ message: "Error adding adress" });
      }
    }
  );
}
