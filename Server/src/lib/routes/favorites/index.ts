import { FastifyInstance } from "fastify";

import { addToFavorites } from "./addToFavorites";
import { getFavorites } from "./getFavorites";
import { removeFromFavorites } from "./removeFromFavorites";

export async function favoritesRoutes(app: FastifyInstance) {
  await addToFavorites(app);
  await getFavorites(app);
  await removeFromFavorites(app);
}
