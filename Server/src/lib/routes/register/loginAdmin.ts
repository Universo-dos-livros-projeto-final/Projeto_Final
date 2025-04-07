import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";

export async function loginAdmin(app: FastifyInstance) {
  app.post("/admin/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    let credentials;
    try {
      credentials = loginSchema.parse(request.body);
    } catch (error) {
      return reply.status(400).send({ message: "Invalid email or password format" });
    }

    const { email, password } = credentials;

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const isValidPassword = admin.password === password;

    if (!isValidPassword) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: admin.id, role: "admin" },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "24h" }
    );

    return reply.send({ message: "Admin logged in", token });
  });
}