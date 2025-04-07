import fastify from "fastify";
import cors from "@fastify/cors";
import prismaPlugin from './lib/plugins/prisma';

import { registerRoutes } from "./lib/routes/register";

const app = fastify();

app.register(prismaPlugin);

app.register(cors)
app.register(registerRoutes)

app.listen({
    port: 3000,
})

.then(() => {
    console.log("Server is listening on port 3000");
})