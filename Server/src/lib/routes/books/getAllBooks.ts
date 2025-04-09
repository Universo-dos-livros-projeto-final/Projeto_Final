import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function getAllBooks(app: FastifyInstance) {
  app.get(
    "/books",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const books = await app.prisma.book.findMany();

        if (books.length === 0) {
          return reply.status(404).send({ message: "No books available" });
        }

        reply.send({ books });
      } catch (error) {
        console.error("Error fetching books:", error);
        reply.status(500).send({ message: "Error fetching books" });
      }
    }
  );
}