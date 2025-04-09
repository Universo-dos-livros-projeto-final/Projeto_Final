import { FastifyInstance } from "fastify";

import { getProfile } from "./getProfile";
import { updateUser } from "./updateProfile";
import { deleteUser } from "./deleteUser";
import { addAdress } from "./addAdress";
import { getAdresses } from "./getAdresses";
import { deleteAdress } from "./deleteAdress";
import { getPurchasedBooks } from "./getPurchasedBooks";

export async function userRoutes(app: FastifyInstance) {
  await getProfile(app);
  await updateUser(app);
  await deleteUser(app);
  await addAdress(app);
  await getAdresses(app);
  await deleteAdress(app);
  await getPurchasedBooks(app);

}