import { FastifyInstance } from "fastify";

import { loginUser } from "./loginUser";
import { loginAdmin } from "./loginAdmin";
import { signupUser } from "./signupUser";
import { validateToken } from "./validateToken"; 


export async function registerRoutes(app: FastifyInstance) {
  await loginUser(app);
  await loginAdmin(app);
  await signupUser(app);
  await validateToken(app);
}