import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../register/authentication";

export async function addToCart(app: FastifyInstance) {
  app.post("/cart", { preHandler: [authenticate] }, async (request, reply) => {
    const schema = z.object({
      bookId: z.string().uuid(),
      quantity: z.number().optional().default(1),
    });

    try {
      const { bookId, quantity } = schema.parse(request.body);
      const userId = request.user!.userId;

      // Verificar se o livro existe
      const book = await app.prisma.book.findUnique({
        where: { id: bookId },
        select: { id: true, title: true, price: true, bookphoto: true },
      });

      if (!book) {
        return reply.status(404).send({ success: false, message: "Livro não encontrado" });
      }

      // Verificar se já existe item no carrinho para esse userId + bookId
      const existingItem = await app.prisma.cartItem.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      if (existingItem) {
        // Se existir, atualiza a quantidade somando a existente + a nova quantidade enviada
        const updatedItem = await app.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
          include: {
            book: { select: { title: true, price: true, bookphoto: true } },
          },
        });

        return reply.status(200).send({
          success: true,
          message: "Quantidade atualizada no carrinho",
          updatedItem,
        });
      } else {
        // Se não existir, cria um novo registro no carrinho
        const newItem = await app.prisma.cartItem.create({
          data: { userId, bookId, quantity },
          include: {
            book: { select: { title: true, price: true, bookphoto: true } },
          },
        });

        return reply.status(201).send({
          success: true,
          message: "Item adicionado ao carrinho",
          newItem,
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      return reply.status(500).send({
        success: false,
        message: "Erro interno ao processar a requisição",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  });
}
