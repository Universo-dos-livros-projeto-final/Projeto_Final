import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function getBookDetails(app: FastifyInstance) {
  app.get(
    "/books/:bookId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { bookId } = request.params as { bookId: string }; 

        const book = await app.prisma.book.findUnique({
          where: { id: bookId }, 
        });

        if (!book) {
          return reply.status(404).send({ message: "Book not found" });
        }

        reply.send({ book });
      } catch (error) {
        console.error("Error fetching book details:", error);
        reply.status(500).send({ message: "Error fetching book details" });
      }
    }
  );
}