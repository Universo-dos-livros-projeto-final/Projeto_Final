import { FastifyInstance } from "fastify";
import { z } from "zod";

export function signupUser(app: FastifyInstance) {
  app.post("/signup", async (request, reply) => {
    const register = z.object({
      firstname: z.string().min(1, "First name is required"),
      lastname: z.string().min(1, "Last name is required"),
      email: z.string().email("Invalid email format"),
      password: z.string().min(8, "Password should be at least 8 characters long"),
    });

    let userData;
    try {
      userData = register.parse(request.body);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(errorMessage);
      return reply.code(400).send({ message: errorMessage });
    }

    const { firstname, lastname, email, password } = userData;

    const existingUser = await app.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const errorMessage = "Email is already registered";
      console.error(errorMessage);
      return reply.code(400).send({ message: errorMessage });
    }

    try {
      await app.prisma.user.create({
        data: {
          firstname,
          lastname,
          email,
          password,  
          createdAt: new Date(),
          isBlocked: false,
          isAdmin: false, 
        },
      });

      reply.send({ message: "User created successfully" });

    } catch (error) {
      console.error("Error creating user:", error);
      return reply.code(500).send({ message: "Internal Server Error" });
    }
  });
}



