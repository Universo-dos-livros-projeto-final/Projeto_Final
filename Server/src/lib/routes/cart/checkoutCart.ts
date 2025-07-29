import { FastifyInstance } from "fastify";
import { authenticate } from "../register/authentication";

export async function checkoutCart(app: FastifyInstance) {
  app.post("/cart/checkout", { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user!.userId;

    try {
      const cartItems = await app.prisma.cartItem.findMany({
        where: { userId },
        include: { book: true },
      });

      if (cartItems.length === 0) {
        return reply.status(400).send({ message: "Carrinho está vazio" });
      }

      const total = cartItems.reduce((sum, item) => {
        return sum + item.book.price * item.quantity;
      }, 0);

      // Criar registros de compra (sem o campo 'price' pois não existe no model Purchase)
      const purchasesData = cartItems.map(item => ({
        userId,
        bookId: item.bookId,
        quantity: item.quantity,
      }));

      await app.prisma.purchase.createMany({
        data: purchasesData,
      });

      // Limpar o carrinho
      await app.prisma.cartItem.deleteMany({
        where: { userId },
      });

      return reply.send({
        message: "Compra finalizada com sucesso",
        total: total.toFixed(2),
        items: cartItems.length,
      });

    } catch (error) {
      console.error("Erro no checkout:", error);
      return reply.status(500).send({ message: "Erro interno do servidor" });
    }
  });
}
