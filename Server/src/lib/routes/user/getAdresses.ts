import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";  

export async function getAdresses(app: FastifyInstance) {
  app.get(
    "/user/adress", 
    { preHandler: [authenticate] }, 
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;  

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

        const adress = await app.prisma.adress.findFirst({
          where: { userId },
        });

        if (!adress) {
          return reply.status(404).send({ message: "Adress not found" });
        }

        reply.send({ adress });
      } catch (error) {
        console.error("Error getting adress:", error);
        reply.status(500).send({ message: "Error getting adress" });
      }
    }
  );
}
