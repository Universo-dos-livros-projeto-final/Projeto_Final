import 'fastify';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }

  interface FastifyRequest {
    user?: {
      userId: string;
    }
  }

  interface FastifyReply {
    setCookie: (
      name: string,
      value: string,
      options?: {
        domain?: string;
        path?: string;
        expires?: Date;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: boolean | 'strict' | 'lax' | 'none';
      }
    ) => FastifyReply;

    clearCookie: (
      name: string,
      options?: {
        path?: string;
      }
    ) => FastifyReply;
  }
}
