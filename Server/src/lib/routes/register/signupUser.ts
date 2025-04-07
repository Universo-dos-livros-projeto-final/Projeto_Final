import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../prisma";

export function signupUser(app: FastifyInstance) {
  app.post("/signup", async (request, reply) => {
      const register = z.object({
        firstname: z.string(),
        lastname: z.string(),
        email: z.string(),
        password: z.string(),
      });
  
      let userData;
  
      try {
        userData = register.parse(request.body);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknow error";
        console.error(errorMessage);
        reply.code(400).send(errorMessage);
        return;
      }
  
      const { firstname, lastname, email, password } = userData;
  
      if (!firstname || !lastname || !email || !password) {
        const errorMessage = "Missing required fields";
        console.error(errorMessage);
        reply.code(400).send(errorMessage);
        return;
      }
  
      console.log(firstname, lastname, email, password);
  
      await prisma.user.create({
        data: {
          firstname,
          lastname,
          email,
          password,
          createdAt: new Date(),
          isBlocked: false,
        },
      });
  
      reply.send({ message: "User created sucessfully" });
    });
}