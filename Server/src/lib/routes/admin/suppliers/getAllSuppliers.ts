import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function getAllSuppliers(app: FastifyInstance) {
  app.get(
    "/admin/suppliers",
    { preHandler: [authenticateAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const suppliers = await app.prisma.supplier.findMany();

        return reply.send({ suppliers });
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        return reply.status(500).send({ message: "Error fetching suppliers" });
      }
    }
  );
}
