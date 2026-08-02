import app from './app.js';
import { appConfig } from './config/app.js';
import { prisma } from './lib/prisma.js';
import { redis } from './lib/redis.js';
import { dispatchWorker } from './workers/dispatch.worker.js';
import { logger } from './lib/logger.js';

const server = app.listen(appConfig.port, () => {
  logger.info(`🚀 Server running on port ${appConfig.port} in ${appConfig.env} mode`);
  logger.info(`Docs available at http://localhost:${appConfig.port}/docs`);
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // Stop HTTP server
  server.close(() => {
    logger.info('HTTP server closed.');
  });

  // Close BullMQ workers
  try {
    await dispatchWorker.close();
    logger.info('BullMQ worker closed.');
  } catch (err) {
    logger.error({ error: err }, 'Error during BullMQ worker shutdown');
  }

  // Disconnect Redis
  try {
    await redis.quit();
    logger.info('Redis connection closed.');
  } catch (err) {
    logger.error({ error: err }, 'Error during Redis disconnect');
  }

  // Disconnect Prisma Client
  try {
    await prisma.$disconnect();
    logger.info('Prisma Client disconnected.');
  } catch (err) {
    logger.error({ error: err }, 'Error during Prisma Client disconnect');
  }

  logger.info('Graceful shutdown complete.');
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
