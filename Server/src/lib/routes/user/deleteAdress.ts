import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication"; 

export async function deleteAdress(app: FastifyInstance) {
  app.delete(
    "/user/adress/:adressId", 
    { preHandler: [authenticate] },  
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;  
        const { adressId } = request.params as { adressId: string };  

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

        const adressToDelete = await app.prisma.adress.findUnique({
          where: { id: adressId },
        });

        if (!adressToDelete) {
          return reply.status(404).send({ message: "Adress not found" });
        }

        if (adressToDelete.userId !== userId) {
          return reply.status(403).send({ message: "You are not authorized to delete this adress" });
        }

        await app.prisma.adress.delete({
          where: { id: adressId },
        });

        reply.send({ message: "Adress deleted successfully" });
      } catch (error) {
        console.error("Error deleting adress:", error);
        reply.status(500).send({ message: "Error deleting adress" });
      }
    }
  );
}
