import fastify from "fastify";
import fastifyCookie from "fastify-cookie";
import cors from "@fastify/cors";
import dotenv from 'dotenv';

import prismaPlugin from './lib/plugins/prisma';

import { registerRoutes } from "./lib/routes/register";
import { userRoutes } from "./lib/routes/user";
import { authenticatedUserRoutes } from "./lib/routes/user/books";
import { booksRoute } from "./lib/routes/books";
import { adminBookRoutes } from "./lib/routes/admin/books";
import { adminSupplierRoutes } from "./lib/routes/admin/suppliers";
import { adminUserRoutes } from "./lib/routes/admin/users";
import { logout } from "./lib/routes/logout/logout";
import { cartRoutes } from './lib/routes/cart';
import { favoritesRoutes } from './lib/routes/favorites';

dotenv.config();

const app = fastify();

app.register(prismaPlugin);

app.register(fastifyCookie);

app.register(cors)
app.register(registerRoutes)
app.register(userRoutes)
app.register(authenticatedUserRoutes)
app.register(booksRoute)
app.register(adminBookRoutes)
app.register(adminSupplierRoutes)
app.register(adminUserRoutes)
app.register(logout)
app.register(cartRoutes);
app.register(favoritesRoutes);

app.listen({
    port: 3000,
})

.then(() => {
    console.log("Server is listening on port 3000");
})