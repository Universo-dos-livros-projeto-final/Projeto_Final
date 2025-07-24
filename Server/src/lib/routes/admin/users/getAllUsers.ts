import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function getAllUsers(app: FastifyInstance) {
  app.get("/admin/users", { preHandler: [authenticateAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await app.prisma.user.findMany({
        include: {
          addresses: true,
          purchases: true,
        },
      });

      const sanitizedUsers = users.map(({ password, ...rest }) => rest);

      reply.send(sanitizedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      reply.status(500).send({ message: "Error fetching users" });
    }
  });
}
