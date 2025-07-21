import { FastifyInstance } from "fastify";

import { getAllUsers } from "./getAllUsers";
import { getUserById } from "./getUserById";
import { getBlockedUsers } from './getBlockedUsers';
import { blockOrUnblockUser } from "./blockOrUnblockUser";
import { deleteUser } from "./deleteUser";

export async function adminUserRoutes(app: FastifyInstance){
  await getAllUsers(app);
  await getUserById(app);
  await blockOrUnblockUser(app);
  await deleteUser(app);
  await getBlockedUsers(app);
}