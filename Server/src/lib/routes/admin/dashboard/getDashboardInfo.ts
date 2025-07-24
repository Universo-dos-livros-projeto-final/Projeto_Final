import { FastifyInstance } from "fastify";
import { authenticate } from "../../register/authentication";

export async function getDashboardInfo(app: FastifyInstance) {
  app.get("/admin/dashboard/info", { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const clients = await app.prisma.user.count({ where: { isAdmin: false } });
      const favorites = await app.prisma.favorite.count();
      const totalVendidos = await app.prisma.purchase.count();

      reply.send({
        clients,
        favorites,
        totalVendidos,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Erro ao buscar estatísticas do dashboard" });
    }
  });
}
