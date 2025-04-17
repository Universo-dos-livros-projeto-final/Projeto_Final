import { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { authenticateAdmin } from "../../register/authenticationAdmin";

export async function createBook(app: FastifyInstance) {
  app.post("/admin/book", { preHandler: [authenticateAdmin] }, async (request, reply: FastifyReply) => {
    const bodySchema = z.object({
      title: z.string(),
      author: z.string(),
      publicationYear: z.number(),
      genre: z.string(),
      isbn: z.string(),
      price: z.number(),
      supplierId: z.string().optional(),
    });

    try {
      const { title, author, publicationYear, genre, isbn, price, supplierId } = bodySchema.parse(request.body);

      const existingBook = await app.prisma.book.findUnique({
        where: { isbn },
      });

      if (existingBook) {
        return reply.status(409).send({ message: "Book with this ISBN already exists" });
      }

      if (supplierId) {
        const supplierExists = await app.prisma.supplier.findUnique({
          where: { id: supplierId },
        });

        if (!supplierExists) {
          return reply.status(404).send({ message: "Supplier not found" });
        }
      }

      const book = await app.prisma.book.create({
        data: {
          title,
          author,
          publicationYear,
          genre,
          isbn,
          price,
          supplierId,
        },
      });

      reply.status(201).send(book);
    } catch (error) {
      console.error("Error creating book:", error);
      reply.status(400).send({ message: "Failed to create book" });
    }
  });
}
