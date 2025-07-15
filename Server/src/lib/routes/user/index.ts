import { FastifyInstance } from "fastify";

import { getProfile } from "./getProfile";
import { updateUser } from "./updateProfile";
import { deleteUser } from "./deleteUser";
import { addAddress } from "./addAddress";
import { getAddresses } from "./getAddresses";
import { updateAddress } from "./updateAddress";  
import { deleteAddress } from "./deleteAddress";
import { listUserPurchases } from "./listUserPurchases";
import { deletePurchase } from "./deletePurchase";
import { updateUserPhoto } from "./updateProfilePhoto";

export async function userRoutes(app: FastifyInstance) {
  await getProfile(app);
  await updateUser(app);
  await deleteUser(app);
  await addAddress(app);
  await getAddresses(app);
  await updateAddress(app);
  await deleteAddress(app);
  await listUserPurchases(app);
  await deletePurchase(app);
  await updateUserPhoto(app); 
}