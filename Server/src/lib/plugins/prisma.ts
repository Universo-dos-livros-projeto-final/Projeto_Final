import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default fp(async function (app) {
  app.decorate('prisma', prisma);
});
