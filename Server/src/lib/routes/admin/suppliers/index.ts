import { FastifyInstance } from "fastify";

import { createSupplier } from "./createSupplier";
import { getAllSuppliers } from "./getAllSuppliers";
import { updateSupplier } from "./updateSupplier";
import { deleteSupplier } from "./deleteSupplier";

export async function adminSupplierRoutes(app: FastifyInstance) {
  await createSupplier(app);
  await getAllSuppliers(app);
  await updateSupplier(app);
  await deleteSupplier(app);
}