import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function updateUserPhoto(app: FastifyInstance) {
  app.patch(
    "/user/photo-url",
    { preHandler: [authenticate] },
    async (request, reply) => {
      try {
        const { photoUrl } = request.body as { photoUrl?: string };
        const userId = (request as any).user?.userId;

        if (!photoUrl || !userId) {
          return reply.status(400).send({ message: "Dados inválidos" });
        }

        const updated = await app.prisma.user.update({
          where: { id: userId },
          data: { profilephoto: photoUrl },
        });

        return reply.send({ profilephoto: updated.profilephoto });
      } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        return reply.status(500).send({ message: "Erro interno ao atualizar a foto." });
      }
    }
  );
}
