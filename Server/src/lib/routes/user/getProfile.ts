import { FastifyInstance, FastifyReply } from "fastify";
import { authenticate } from "../register/authentication"; 

export async function getProfile(app: FastifyInstance) {
  app.get("/user", { preHandler: [authenticate] }, async (request, reply: FastifyReply) => {
    try {
      
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const user = await app.prisma.user.findUnique({
        where: { id: userId },
        include: {
          adresses: true,
          booksPurchased: true,
        },
      });

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const { password, ...safeUser } = user;

      reply.send(safeUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      reply.status(500).send({ message: "Error fetching user" });
    }
  });
}
