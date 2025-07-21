import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { z } from "zod";

export async function loginAdmin(app: FastifyInstance) {
  app.post("/admin/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6, "Password should be at least 6 characters long"),
    });

    let credentials;
    try {
      credentials = loginSchema.parse(request.body);
    } catch (error) {
      return reply.status(400).send({ message: "Invalid email or password format" });
    }

    const { email, password } = credentials;

    const admin = await app.prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const isValidPassword = admin.password === password;

    if (!isValidPassword) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id },  
      process.env.JWT_SECRET as string,  
      { expiresIn: '1h' }  
    );

    return reply.send({ message: "Admin logged in", token });
  });
}