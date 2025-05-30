import { FastifyInstance, FastifyReply } from "fastify";
import { authenticate } from "../register/authentication";

export async function logout(app: FastifyInstance) {
  app.post("/logout", { preHandler: [authenticate] }, async (request, reply: FastifyReply) => {
    try {
      reply.setCookie("token", "", {
        path: "/",
        expires: new Date(0), 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict" 
      });
      
      reply.send({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error logging out:", error);
      reply.status(500).send({ message: "Error logging out" });
    }
  });
}
