import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },  
    });

    if (!user || user.isBlocked) {
      return reply.status(403).send({ message: 'User not found or blocked' });
    }

    if (!user.isAdmin) {
      return reply.status(403).send({ message: 'Forbidden: Not an admin' });
    }

    request.user = { userId: user.id };

    return true;
  } catch (error) {
    console.error("Error in authenticateAdmin:", error);
    return reply.status(401).send({ message: 'Invalid or expired token' });
  }
}
