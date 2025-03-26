import fastify from "fastify";
import cors from "@fastify/cors";
import { registerRoutes } from "./lib/routes";


const app = fastify();

app.register(cors)
app.register(registerRoutes)

app.listen({
    port: 3000,
})

.then(() => {
    console.log("Server is listening on port 3000");
})