import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { prisma } from "./prisma";
import { z } from "zod";

declare module "fastify" {
  interface FastifyRequest {
    user?: {userId: string}
  }
}

const invalidTokens: string[] = [];

function invalidTouken(token:string) {
  invalidTokens.push(token);
}

type UserData = {
  email: string;
  password: string;
}

function getUserFromToken(authHeader: string) {
  const token = authHeader.split(" ")[1];
  try {
    const decoded =
      process.env.JWT_SECRET &&
      (jwt.verify(token, process.env.JWT_SECRET) as { userId: string });
    return decoded;
  } catch (error: any) {
    throw new Error("Invalid token");
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new Error("Authorization header missing");

    const user = await getUserFromToken(authHeader);
   
    if (invalidTokens.includes(authHeader)) {
      throw new Error("Token invalidated");
    }

    request["user"] = user as { userId: string };
  } catch (error: any) {
    console.error(error.message);
    reply.status(401).send({ message: "Unauthorized" });
    throw new Error("Unauthorized");
  }
}

export async function registerRoutes(app: FastifyInstance) {
  
  app.get("/status", (req, res) => {
    res.status(200).send({ message: "API is up and running" });
  });

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

    const user = await prisma.user.findUnique({
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
      { email: user.email },
      process.env.JWT_SECRET || "default-secret",
      jwtOptions
    );
    reply.send({ message: "User logged in successfully", token });
  });

  app.get("/users", async (request, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new Error("Authorization header missing");
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        throw new Error("Token missing");
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default-secret"
      ) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { email: decoded.email},
      });

      if (user) {
        reply.send(user);
      } else {
        reply.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      reply.status(500).send({ message: "Error fetching user" });
    }
  });
}