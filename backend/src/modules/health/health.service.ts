import { prisma } from '../../lib/prisma.js';
import { redis } from '../../lib/redis.js';

export class HealthService {
  async checkLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    };
  }

  async checkReadiness() {
    let dbConnected = false;
    let redisConnected = false;

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (err) {
      // Caught database connection error
    }

    try {
      const pingRes = await redis.ping();
      redisConnected = pingRes === 'PONG';
    } catch (err) {
      // Caught Redis connection error
    }

    const isHealthy = dbConnected && redisConnected;

    return {
      healthy: isHealthy,
      details: {
        status: isHealthy ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        db: dbConnected ? 'connected' : 'disconnected',
        redis: redisConnected ? 'connected' : 'disconnected',
        version: '1.0.0',
      }
    };
  }
}
export const healthService = new HealthService();
