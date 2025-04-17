import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticateAdmin } from "../../register/authenticationAdmin";

interface Params {
  id: string;
}

export async function deleteBook(app: FastifyInstance) {
  app.delete<{ Params: Params }>(
    "/admin/book/:id",
    { preHandler: [authenticateAdmin] },
    async (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const { id } = request.params; 

      try {
        const book = await app.prisma.book.findUnique({
          where: { id },
        });

        if (!book) {
          return reply.status(404).send({ message: "Book not found" });
        }

        await app.prisma.book.delete({
          where: { id },
        });

        reply.send({ message: "Book deleted successfully" });
      } catch (error) {
        console.error("Error deleting book:", error);
        reply.status(400).send({ message: "Failed to delete book" });
      }
    }
  );
}