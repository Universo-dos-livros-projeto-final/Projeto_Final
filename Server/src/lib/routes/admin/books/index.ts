import { FastifyInstance } from "fastify";

import { createBook } from "./createBook";
import { updateBook } from "./updateBook";
import { deleteBook } from "./deleteBook";

export async function adminBookRoutes(app: FastifyInstance) {
  await createBook(app);
  await updateBook(app);
  await deleteBook(app);
}