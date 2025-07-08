import { FastifyInstance } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import { authenticate } from "../register/authentication";
import fs from "fs";
import path from "path";

export async function updateUserPhoto(app: FastifyInstance) {
  app.patch(
    "/user/photo",
    { preHandler: [authenticate] },
    async (request, reply) => {
      try {
        // Faz cast apenas aqui dentro para usar .file()
        const fileRequest = request as typeof request & {
          file: () => Promise<MultipartFile>;
          user: { userId: string };
        };

        const data = await fileRequest.file();
        const userId = fileRequest.user?.userId;

        if (!data || !userId) {
          return reply.status(400).send({ message: "Dados inválidos" });
        }

        const filename = `${userId}_${Date.now()}_${data.filename}`;
        const uploadDir = path.join(__dirname, "../../uploads");
        const filepath = path.join(uploadDir, filename);

        await fs.promises.mkdir(uploadDir, { recursive: true });
        await fs.promises.writeFile(filepath, await data.toBuffer());

        const photoUrl = `/uploads/${filename}`;

        const updated = await app.prisma.user.update({
          where: { id: userId },
          data: { profilephoto: photoUrl },
        });

        return reply.send({ profilephoto: updated.profilephoto });
      } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        return reply.status(500).send({ message: "Erro interno ao enviar a foto." });
      }
    }
  );
}
