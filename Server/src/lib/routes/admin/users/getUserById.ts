import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function getUserById(app: FastifyInstance) {
  app.get("/admin/user/:id", { preHandler: [authenticateAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };

      const user = await app.prisma.user.findUnique({
        where: { id },
        include: {
          addresses: true,
          purchases: true,
        },
      });

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const { password, ...safeUser } = user;
      reply.send(safeUser);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      reply.status(500).send({ message: "Error fetching user" });
    }
  });
}
