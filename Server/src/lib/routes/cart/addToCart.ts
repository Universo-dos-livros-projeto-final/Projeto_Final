import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../register/authentication";

export async function addToCart(app: FastifyInstance) {
  app.post("/cart", { preHandler: [authenticate] }, async (request, reply) => {
    const schema = z.object({
      bookId: z.string().uuid(),
      quantity: z.number().optional().default(1)
    });

    try {
      const { bookId, quantity } = schema.parse(request.body);
      const userId = request.user!.userId;

      // Verificar se o livro existe  
      const book = await app.prisma.book.findUnique({
        where: { id: bookId },
        select: {
          id: true,
          title: true,
          price: true,
          bookphoto: true
        }
      });

      if (!book) {
        return reply.status(404).send({ 
          success: false,
          message: "Livro não encontrado" 
        });
      }

      // Verificar se o item já existe no carrinho
      const existingItem = await app.prisma.cartItem.findFirst({
        where: { userId, bookId },
      });

      let updatedItem;

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (existingItem) {
  const newQuantity = existingItem.quantity + quantity;

  if (newQuantity <= 0) {
    await app.prisma.cartItem.delete({
      where: { id: existingItem.id }
    });

    return reply.status(200).send({
      success: true,
      message: "Item removido do carrinho",
      removed: true,
      bookId
    });
  }
}
        // Atualizar item existente
        updatedItem = await app.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
          include: {
            book: {
              select: {
                title: true,
                price: true,
                bookphoto: true
              }
            }
          }
        });

      } else {
        // Criar novo item
        updatedItem = await app.prisma.cartItem.create({
          data: {
            userId,
            bookId,
            quantity,
          },
          include: {
            book: {
              select: {
                title: true,
                price: true,
                bookphoto: true
              }
            }
          }
        });
      }

      // Buscar o carrinho atualizado
      const cart = await app.prisma.cartItem.findMany({
        where: { userId },
        include: {
          book: {
            select: {
              title: true,
              price: true,
              bookphoto: true
            }
          }
        }
      });

      return reply.status(200).send({
        success: true,
        message: existingItem ? "Quantidade atualizada no carrinho" : "Item adicionado ao carrinho",
        updatedItem: {
          id: updatedItem.id,
          quantity: updatedItem.quantity,
          book: {
            id: book.id,
            title: book.title,
            price: book.price,
            bookphoto: book.bookphoto
          }
        },
        cart: cart
      });

    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      return reply.status(500).send({
        success: false,
        message: "Erro interno ao processar a requisição",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}