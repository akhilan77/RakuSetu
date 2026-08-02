import { Redis } from 'ioredis';
import { env } from '../config/env.js';
import { logger } from './logger.js';

const redisClientSingleton = () => {
  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null, // Required for BullMQ compatibility
  });

  client.on('connect', () => {
    logger.info('Connected to Redis server');
  });

  client.on('error', (err) => {
    logger.error({ error: err }, 'Redis connection error');
  });

  return client;
};

declare global {
  var redisGlobal: undefined | ReturnType<typeof redisClientSingleton>;
}

export const redis = globalThis.redisGlobal ?? redisClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.redisGlobal = redis;
