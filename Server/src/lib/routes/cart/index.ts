import { FastifyInstance } from "fastify";

import { addToCart } from "./addToCart";
import { getCart } from "./getCart";
import { removeFromCart } from "./removeFromCart";
import { checkoutCart } from "./checkoutCart";

export async function cartRoutes(app: FastifyInstance) {
  await addToCart(app);
  await getCart(app);
  await removeFromCart(app);
  await checkoutCart(app);
}
