import { FastifyInstance } from "fastify";
import jwt, { SignOptions } from "jsonwebtoken";

type UserData = {
  email: string;
  password: string;
};

export function loginUser(app: FastifyInstance) {
  app.post("/login", async (request, reply) => {
      let userData: UserData;
  
      try {
        userData = request.body as UserData;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(errorMessage);
        reply.code(400).send(errorMessage);
        return;
      }
  
      const { email, password } = userData;
  
      const user = await app.prisma.user.findUnique({
        where: {
          email,
        },
      });
  
      if (!user || user.password !== password) {
        const errorMessage = "Invalid username or password";
        console.error(errorMessage);
        reply.code(401).send({ message: errorMessage });
        return;
      }
  
      const jwtOptions: SignOptions = {
        expiresIn: "24h",
      };
  
      const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "default-secret",
      jwtOptions
    );


      reply.send({ message: "User logged in successfully", token });
    });
}