import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function deleteUser(app: FastifyInstance) {
  app.delete(
    "/admin/user/:id",
    { preHandler: [authenticateAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const paramsSchema = z.object({
          id: z.string().uuid(),
        });

        const { id } = paramsSchema.parse(request.params);

        const userExists = await app.prisma.user.findUnique({
          where: { id },
        });

        if (!userExists) {
          return reply.status(404).send({ message: "User not found" });
        }

        await app.prisma.user.delete({
          where: { id },
        });

        reply.send({ message: "User deleted successfully", userId: id });
      } catch (error) {
        console.error("Error deleting user:", error);
        reply.status(500).send({ message: "Error deleting user" });
      }
    }
  );
}
