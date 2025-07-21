import { FastifyInstance } from "fastify";

import { addToCart } from "./addToCart";
import { getCart } from "./getCart";
import { removeFromCart } from "./removeFromCart";
import { checkoutCart } from "./checkoutCart";
import { updateCart } from "./updateCart";  

export async function cartRoutes(app: FastifyInstance) {
  await addToCart(app);
  await getCart(app);
  await removeFromCart(app);
  await checkoutCart(app);
  await updateCart(app);  
}
