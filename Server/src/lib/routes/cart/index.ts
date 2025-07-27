import { FastifyInstance } from "fastify";

import { addToCart } from "./addToCart";
import { getCart } from "./getCart";
import { removeFromCart } from "./removeFromCart";
import { checkoutCart } from "./checkoutCart";
import { updateCart } from "./updateCart";  
import { createIntent } from "./createIntent";



export async function cartRoutes(app: FastifyInstance) {
  await addToCart(app);
  await getCart(app);
  await removeFromCart(app);
  await checkoutCart(app);
  await updateCart(app);  
  await createIntent(app);
}
