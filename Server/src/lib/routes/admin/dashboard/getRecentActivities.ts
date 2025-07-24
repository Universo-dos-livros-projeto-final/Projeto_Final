import { FastifyInstance } from "fastify";
import { authenticate } from "../../register/authentication";

export async function getRecentActivities(app: FastifyInstance) {
  app.get("/admin/dashboard/recent", { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const atividadesRecentes = await app.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { isAdmin: false },
        select: {
          firstname: true,
          lastname: true,
          email: true,
          createdAt: true,
          isBlocked: true,
        },
      });

      reply.send({ atividadesRecentes });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar atividades recentes" });
    }
  });
}
