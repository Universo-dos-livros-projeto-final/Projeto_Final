import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";

export async function updateUser(app: FastifyInstance) {
  app.patch(
    "/user",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

        const { firstname, lastname, email, password } = request.body as {
          firstname?: string;
          lastname?: string;
          email?: string;
          password?: string;
        };

        const updatedUser = await app.prisma.user.update({
          where: { id: userId },
          data: {
            firstname,
            lastname,
            email,
            password,
          },
        });

        reply.send(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        reply.status(500).send({ message: "Error updating user" });
      }
    }
  );
}
