import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user?: { userId: string };
  }
}

function getUserFromToken(authHeader: string) {
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret") as { userId: string };
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      reply.status(400).send({ message: "Authorization header missing" });
      throw new Error("Authorization header missing");
    }

    const user = getUserFromToken(authHeader);

    request.user = { userId: user.userId };

  } catch (error: any) {
    console.error("Authentication error:", error.message);
    reply.status(401).send({ message: "Unauthorized" });
  }
}