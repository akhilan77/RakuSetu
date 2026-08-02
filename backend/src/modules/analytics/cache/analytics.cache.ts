import { redis } from '../../../lib/redis.js';
import { logger } from '../../../lib/logger.js';
import { CACHE_TTL } from '../analytics.constants.js';

export class AnalyticsCacheService {
  async getOrSetCache(key: string, fetchFn: () => Promise<any>): Promise<any> {
    const cached = await redis.get(key);
    if (cached) {
      logger.debug({ key }, 'Analytics cache hit');
      return JSON.parse(cached);
    }
    
    logger.debug({ key }, 'Analytics cache miss, fetching fresh data');
    const fresh = await fetchFn();
    await redis.set(key, JSON.stringify(fresh), 'EX', CACHE_TTL);
    return fresh;
  }

  async invalidateDonorAnalytics(): Promise<void> {
    let cursor = '0';
    let totalDeleted = 0;
    
    do {
      const [newCursor, keys] = await redis.scan(cursor, 'MATCH', 'analytics:donors:*', 'COUNT', 100);
      cursor = newCursor;
      
      if (keys.length > 0) {
        await redis.del(...keys);
        totalDeleted += keys.length;
      }
    } while (cursor !== '0');
    
    logger.info({ totalDeleted }, 'Invalidated donor analytics caches');
  }

  async invalidateDemandAnalytics(): Promise<void> {
    // Skeleton for future Day 8B integrations
  }

  async invalidateOverviewAnalytics(): Promise<void> {
    // Skeleton for future Day 8B integrations
  }
}
export const analyticsCacheService = new AnalyticsCacheService();
