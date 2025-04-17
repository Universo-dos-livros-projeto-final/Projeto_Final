import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function blockOrUnblockUser(app: FastifyInstance) {
  app.patch("/admin/user/:id/block", { preHandler: [authenticateAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const bodySchema = z.object({
        block: z.boolean(),
      });

      const { id } = paramsSchema.parse(request.params);
      const { block } = bodySchema.parse(request.body);

      const user = await app.prisma.user.update({
        where: { id },
        data: {
          isBlocked: block,
        },
      });

      reply.send({
        message: `User ${block ? 'blocked' : 'unblocked'} successfully`,
        userId: user.id,
        isBlocked: user.isBlocked,
      });
    } catch (error: any) {
      console.error("Error updating user block status:", error);
      reply.status(500).send({ message: "Error updating user status" });
    }
  });
}
