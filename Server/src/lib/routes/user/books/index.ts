import { FastifyInstance } from "fastify";

import { buyBook } from "./buyBook";

export async function authenticatedUserRoutes(app: FastifyInstance){
  await buyBook(app);
}