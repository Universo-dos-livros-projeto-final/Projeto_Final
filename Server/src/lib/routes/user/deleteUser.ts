import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../register/authentication";  

export async function deleteUser(app: FastifyInstance) {
  app.delete(
    "/user",
    { preHandler: [authenticate] },  
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.userId;  

        if (!userId) {
          return reply.status(400).send({ message: "User not found" });
        }

        const deletedUser = await app.prisma.user.delete({
          where: { id: userId },
        });

        reply.send({ message: "User deleted successfully", user: deletedUser });
      } catch (error) {
        console.error("Error deleting user:", error);
        reply.status(500).send({ message: "Error deleting user" });
      }
    }
  );
}