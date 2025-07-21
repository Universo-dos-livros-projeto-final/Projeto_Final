import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function authenticateAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      return reply.status(401).send({ message: 'Authorization token is missing' });
    }

    interface DecodedToken {
      id: string;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      return reply.status(403).send({ message: 'Admin not found' });
    }

    request.user = { userId: admin.id };

    return true;
  } catch (error) {
    console.error("Error in authenticateAdmin:", error);
    return reply.status(401).send({ message: 'Invalid or expired token' });
  }
}

