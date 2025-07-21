import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function getBlockedUsers(app: FastifyInstance) {
  app.get("/admin/users/blocked", { preHandler: [authenticateAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const blockedUsers = await app.prisma.user.findMany({
        where: {
          isBlocked: true,
        },
        include: {
          addresses: true,
          purchases: true,
        },
      });

      const sanitizedBlockedUsers = blockedUsers.map(({ password, ...rest }) => rest);

      reply.send(sanitizedBlockedUsers);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      reply.status(500).send({ message: "Error fetching blocked users" });
    }
  });
}

