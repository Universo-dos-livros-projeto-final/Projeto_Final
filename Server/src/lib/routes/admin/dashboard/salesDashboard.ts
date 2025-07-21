import { FastifyInstance } from "fastify";
import { authenticate } from "../../register/authentication";

export async function salesDashboardRoute(app: FastifyInstance) {
  app.get("/admin/dashboard/sales", { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const sales = await app.prisma.purchase.findMany({
        orderBy: { date: "desc" },
        include: {
          user: true,
          book: true,
        },
      });

      const formattedSales = sales.map((sale) => ({
        id: sale.id,
        customer: `${sale.user.firstname} ${sale.user.lastname}`,
        book: sale.book.title,
        price: sale.book.price,
        quantity: sale.quantity,
        date: sale.date,
        total: sale.quantity * sale.book.price,
      }));

      return reply.send(formattedSales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      return reply.status(500).send({ error: "Failed to fetch sales data" });
    }
  });
}
