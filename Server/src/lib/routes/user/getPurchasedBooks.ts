import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";  

export async function getPurchasedBooks(app: FastifyInstance) {
  app.get(
    "/user/books/purchased", 
    { preHandler: [authenticate] },  
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;  

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

                const userWithBooks = await app.prisma.user.findUnique({
                  where: { id: userId },
                  include: {
                    booksPurchased: true,  
                  },
                });
        
                if (!userWithBooks) {
                  return reply.status(404).send({ message: "User not found" });
                }
        
                if (userWithBooks.booksPurchased.length === 0) {
                  return reply.status(404).send({ message: "No purchased books found" });
                }
        
                reply.send({ booksPurchased: userWithBooks.booksPurchased });
              } catch (error) {
                console.error("Error getting purchased books:", error);
                reply.status(500).send({ message: "Error getting purchased books" });
              }
            }
          );
        }