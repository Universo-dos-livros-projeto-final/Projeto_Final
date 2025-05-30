import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { authenticateAdmin } from "../../register/authenticationAdmin";

interface Params {
  id: string;
}

export async function updateBook(app: FastifyInstance) {
  app.patch<{ Params: Params }>(
    "/admin/book/:id",
    { preHandler: [authenticateAdmin] },
    async (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const bodySchema = z.object({
        title: z.string().optional(),
        author: z.string().optional(),
        publicationYear: z.number().optional(),
        genre: z.string().optional(),
        isbn: z.string().optional(),
        price: z.number().optional(),
        supplierId: z.string().optional(),
      });

      const { id } = request.params; 

      try {
        const book = await app.prisma.book.findUnique({
          where: { id },
        });

        if (!book) {
          return reply.status(404).send({ message: "Book not found" });
        }

        const updatedData = bodySchema.parse(request.body);

        if (updatedData.supplierId) {
          const supplierExists = await app.prisma.supplier.findUnique({
            where: { id: updatedData.supplierId },
          });

          if (!supplierExists) {
            return reply.status(404).send({ message: "Supplier not found" });
          }
        }

        const updatedBook = await app.prisma.book.update({
          where: { id },
          data: updatedData,
        });

        reply.send(updatedBook);
      } catch (error) {
        console.error("Error updating book:", error);
        reply.status(400).send({ message: "Failed to update book" });
      }
    }
  );
}
