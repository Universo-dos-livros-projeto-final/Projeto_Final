import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function deleteSupplier(app: FastifyInstance) {
  app.delete(
    "/admin/supplier/:id",
    { preHandler: [authenticateAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        id: z.string().uuid("Invalid supplier ID"),
      });

      let params;
      try {
        params = paramsSchema.parse(request.params);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid ID";
        return reply.status(400).send({ message });
      }

      try {
        await app.prisma.supplier.delete({
          where: { id: params.id },
        });

        reply.send({ message: "Supplier deleted successfully" });
      } catch (error: any) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Supplier not found" });
        }

        console.error("Error deleting supplier:", error);
        reply.status(500).send({ message: "Error deleting supplier" });
      }
    }
  );
}
