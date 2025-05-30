import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function createSupplier(app: FastifyInstance) {
  app.post("/admin/supplier", { preHandler: [authenticateAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const supplierSchema = z.object({
      name: z.string().min(3, "Name is required"),
      address: z.string().min(1, "Address is required"),
      phone: z.string().min(6, "Phone must be valid"),
    });

    let supplierData;
    try {
      supplierData = supplierSchema.parse(request.body);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid data";
      return reply.status(400).send({ message });
    }

    try {
      const newSupplier = await app.prisma.supplier.create({
        data: supplierData,
      });

      reply.status(201).send(newSupplier);
    } catch (error) {
      console.error("Error creating supplier:", error);
      reply.status(500).send({ message: "Error creating supplier" });
    }
  });
}
