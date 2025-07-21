import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { authenticate } from "../register/authentication";

export async function updateCart(app: FastifyInstance) {
  app.put(
    "/cart",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.user || !request.user.userId) {
        return reply.status(401).send({ message: "Não autorizado" });
      }

      const userId = (request.user as { userId: string }).userId;

      const schema = z.object({
        bookId: z.string().uuid(),
        quantity: z.number().int().min(1),
      });

      let body;
      try {
        body = schema.parse(request.body);
      } catch {
        return reply.status(400).send({ message: "Dados inválidos" });
      }

      const { bookId, quantity } = body;

      try {
        const existingItem = await app.prisma.cartItem.findFirst({
          where: { userId, bookId },
        });

        if (existingItem) {
          await app.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity },
          });
        } else {
          await app.prisma.cartItem.create({
            data: {
              userId,
              bookId,
              quantity,
            },
          });
        }

        return reply.send({ message: "Quantidade atualizada com sucesso" });
      } catch (error) {
        app.log.error("Erro ao atualizar carrinho:", error);
        return reply.status(500).send({
          message: "Erro interno ao atualizar carrinho",
        });
      }
    }
  );
}
