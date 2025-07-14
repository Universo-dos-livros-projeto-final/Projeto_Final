import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../register/authentication";

export async function addToCart(app: FastifyInstance) {
  app.post("/cart", { preHandler: [authenticate] }, async (request, reply) => {
    const schema = z.object({
      bookId: z.string().uuid(),
      quantity: z.number().min(1).optional().default(1),
    });

    const { bookId, quantity } = schema.parse(request.body);
    const userId = request.user!.userId;

    try {
      // Verificar se o livro existe
      const book = await app.prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        return reply.status(404).send({ message: "Livro não encontrado" });
      }

      // Verificar se o item já existe no carrinho
      const existingItem = await app.prisma.cartItem.findFirst({
        where: { userId, bookId },
      });

      if (existingItem) {
        // Atualizar quantidade
        await app.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: quantity },
        });
      } else {
        // Criar novo item
        await app.prisma.cartItem.create({
          data: {
            userId,
            bookId,
            quantity,
          },
        });
      }

      return reply.send({ message: "Livro adicionado ao carrinho" });

    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      return reply.status(500).send({ message: "Erro interno do servidor" });
    }
  });
}
