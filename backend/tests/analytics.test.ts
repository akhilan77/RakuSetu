import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { redis } from '../src/lib/redis.js';
import { prisma } from '../src/lib/prisma.js';
import { analyticsRepository } from '../src/modules/analytics/analytics.repository.js';
import { analyticsService } from '../src/modules/analytics/analytics.service.js';
import { analyticsCacheService } from '../src/modules/analytics/cache/analytics.cache.js';

describe('Healthcare Analytics Module Tests', () => {
  beforeAll(async () => {
    // Make sure we have a clean test start
    await analyticsCacheService.invalidateDonorAnalytics();
  });

  afterAll(async () => {
    await analyticsCacheService.invalidateDonorAnalytics();
    await redis.quit();
    await prisma.$disconnect();
  });

  describe('Repository Aggregations', () => {
    it('should aggregate donor summaries correctly', async () => {
      const summary = await analyticsRepository.getDonorSummary();
      expect(summary).toHaveProperty('totalDonors');
      expect(typeof summary.totalDonors).toBe('number');
    });

    it('should calculate blood group distribution percentages correctly', async () => {
      const distribution = await analyticsRepository.getBloodGroupDistribution();
      expect(distribution).toBeInstanceOf(Array);
      expect(distribution.length).toBe(8); // A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG

      distribution.forEach((item) => {
        expect(item).toHaveProperty('bloodGroup');
        expect(item).toHaveProperty('count');
        expect(item).toHaveProperty('percentage');
        expect(typeof item.count).toBe('number');
        expect(typeof item.percentage).toBe('number');
      });
    });

    it('should calculate eligibility aggregates correctly', async () => {
      const eligibility = await analyticsRepository.getEligibilitySummary();
      expect(eligibility).toBeInstanceOf(Array);
      expect(eligibility).toHaveLength(2); // Eligible, Deferred

      const statuses = eligibility.map((item) => item.status);
      expect(statuses).toContain('Eligible');
      expect(statuses).toContain('Deferred');
    });

    it('should aggregate geographic distributions without throwing', async () => {
      const geography = await analyticsRepository.getGeographicDistribution();
      expect(geography).toBeInstanceOf(Array);
      geography.forEach((item) => {
        expect(item).toHaveProperty('city');
        expect(item).toHaveProperty('district');
        expect(item).toHaveProperty('state');
        expect(item).toHaveProperty('count');
      });
    });

    it('should aggregate donor retention statistics correctly', async () => {
      const stats = await analyticsRepository.getRetentionStats();
      expect(stats).toHaveProperty('firstTimeDonors');
      expect(stats).toHaveProperty('repeatDonors');
      expect(stats).toHaveProperty('averageDonations');
      expect(stats).toHaveProperty('retentionRate');
    });

    it('should compile monthly trends correctly', async () => {
      const trends = await analyticsRepository.getMonthlyDonationTrends();
      expect(trends).toBeInstanceOf(Array);
      expect(trends).toHaveLength(12); // Last 12 months
    });

    it('should aggregate demand summaries correctly', async () => {
      const summary = await analyticsRepository.getDemandSummary();
      expect(summary).toHaveProperty('totalRequests');
      expect(summary).toHaveProperty('activeRequests');
      expect(summary).toHaveProperty('fulfilledRequests');
      expect(summary).toHaveProperty('cancelledRequests');
    });

    it('should calculate blood group demand distributions correctly', async () => {
      const demand = await analyticsRepository.getBloodGroupDemand();
      expect(demand).toBeInstanceOf(Array);
      expect(demand.length).toBe(8);
      demand.forEach((item) => {
        expect(item).toHaveProperty('bloodGroup');
        expect(item).toHaveProperty('requests');
        expect(item).toHaveProperty('percentage');
      });
    });

    it('should aggregate executive overview correctly', async () => {
      const overview = await analyticsRepository.getExecutiveOverview();
      expect(overview).toHaveProperty('donors');
      expect(overview).toHaveProperty('requests');
    });
  });

  describe('Caching & Invalidation Subsystem', () => {
    it('should cache database responses on first query and read from cache on second', async () => {
      const cacheKey = 'analytics:donors:summary:test';
      await redis.del(cacheKey);

      let dbCalls = 0;
      const fetchFn = async () => {
        dbCalls++;
        return { totalDonors: 10 };
      };

      // Call 1: Miss
      const call1 = await analyticsCacheService.getOrSetCache(cacheKey, fetchFn);
      expect(call1.totalDonors).toBe(10);
      expect(dbCalls).toBe(1);

      // Call 2: Hit
      const call2 = await analyticsCacheService.getOrSetCache(cacheKey, fetchFn);
      expect(call2.totalDonors).toBe(10);
      expect(dbCalls).toBe(1); // No new DB call

      // Verify TTL
      const ttl = await redis.ttl(cacheKey);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(300);

      // Cleanup
      await redis.del(cacheKey);
    });

    it('should surgically delete keys matching pattern during invalidation via Redis SCAN', async () => {
      const k1 = 'analytics:donors:k1';
      const k2 = 'analytics:donors:k2';
      const unrelated = 'unrelated:key';

      await redis.set(k1, 'data');
      await redis.set(k2, 'data');
      await redis.set(unrelated, 'data');

      // Invalidate
      await analyticsCacheService.invalidateDonorAnalytics();

      const val1 = await redis.get(k1);
      const val2 = await redis.get(k2);
      const valUnrelated = await redis.get(unrelated);

      expect(val1).toBeNull();
      expect(val2).toBeNull();
      expect(valUnrelated).toBe('data'); // Surgically ignored

      await redis.del(unrelated);
    });

    it('should surgically invalidate demand and overview caches', async () => {
      const kd = 'analytics:demand:k';
      const ko = 'analytics:overview:k';
      
      await redis.set(kd, 'demand-data');
      await redis.set(ko, 'overview-data');

      await analyticsCacheService.invalidateDemandAnalytics();
      expect(await redis.get(kd)).toBeNull();
      expect(await redis.get(ko)).toBe('overview-data');

      await analyticsCacheService.invalidateOverviewAnalytics();
      expect(await redis.get(ko)).toBeNull();
    });
  });
});
