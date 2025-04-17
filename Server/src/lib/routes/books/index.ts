import { FastifyInstance } from "fastify";

import { getAllBooks } from "./getAllBooks";
import { getBookDetails } from "./getBookDetails";

export async function booksRoute(app: FastifyInstance) {
  await getAllBooks(app);
  await getBookDetails(app);
}