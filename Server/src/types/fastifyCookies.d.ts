declare module 'fastify-cookie' {
  import { FastifyPluginAsync } from 'fastify';

  interface CookieOptions {
    domain?: string;
    path?: string;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | 'strict' | 'lax' | 'none';
  }

  const fastifyCookie: FastifyPluginAsync;
  export = fastifyCookie;
}
