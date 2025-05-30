import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function updateSupplier(app: FastifyInstance) {
  app.patch("/admin/supplier/:id", { preHandler: [authenticateAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const paramsSchema = z.object({
      id: z.string().uuid("Invalid supplier ID"),
    });

    const bodySchema = z.object({
      name: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
    });

    let params, data;
    try {
      params = paramsSchema.parse(request.params);
      data = bodySchema.parse(request.body);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid data";
      return reply.status(400).send({ message });
    }

    try {
      const supplier = await app.prisma.supplier.update({
        where: { id: params.id },
        data,
      });

      reply.send(supplier);
    } catch (error) {
      console.error("Error updating supplier:", error);
      reply.status(500).send({ message: "Error updating supplier" });
    }
  });
}
