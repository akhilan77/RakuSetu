import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'error' },
    ],
  });

  // Bind logging events
  client.$on('query' as any, (e: any) => {
    logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, 'Prisma Query');
  });
  client.$on('info' as any, (e: any) => {
    logger.info({ message: e.message }, 'Prisma Info');
  });
  client.$on('warn' as any, (e: any) => {
    logger.warn({ message: e.message }, 'Prisma Warning');
  });
  client.$on('error' as any, (e: any) => {
    logger.error({ message: e.message }, 'Prisma Error');
  });

  return client;
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
