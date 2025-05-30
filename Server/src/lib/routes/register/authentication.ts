import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user?: { userId: string };
  }
}

function getUserFromToken(authHeader: string) {
  const token = authHeader.split(" ")[1]; 
  if (!token) {
    throw new Error("Token is missing");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as { userId: string };
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(400).send({ message: "Authorization header missing" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return reply.status(400).send({ message: "Authorization header must be in the form 'Bearer <token>'" });
    }

    const user = getUserFromToken(authHeader);

    request.user = { userId: user.userId };

  } catch (error: any) {
    console.error("Authentication error:", error.message);
    return reply.status(401).send({ message: "Unauthorized: " + error.message });
  }
}
