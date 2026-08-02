import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { redis } from '../src/lib/redis.js';
import { prisma } from '../src/lib/prisma.js';
import { eligibilityService } from '../src/modules/donors/eligibility.service.js';
import { donorService } from '../src/modules/donors/donor.service.js';
import { analyticsCacheService } from '../src/modules/analytics/cache/analytics.cache.js';

describe('Donor Registration and Eligibility Engine Tests', () => {
  let testUserId: string;

  beforeAll(async () => {
    // Clean up caches
    await analyticsCacheService.invalidateDonorAnalytics();
    await analyticsCacheService.invalidateOverviewAnalytics();
    await analyticsCacheService.invalidateDemandAnalytics();

    // Create a unique test user in the database
    const user = await prisma.user.create({
      data: {
        phone: '+919999123456',
        email: 'testdonor@example.com',
        name: 'Original Name',
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // Cleanup the test user and profiles
    await prisma.donorProfile.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.user.delete({
      where: { id: testUserId },
    });
    
    await redis.quit();
    await prisma.$disconnect();
  });

  describe('Eligibility Engine', () => {
    it('should mark a donor as ELIGIBLE if age and weight guidelines are met', () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 25); // 25 years old
      const result = eligibilityService.calculateEligibility(dob, 65);
      expect(result).toBe('ELIGIBLE');
    });

    it('should mark a donor as TEMPORARILY_DEFERRED if underage', () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 16); // 16 years old
      const result = eligibilityService.calculateEligibility(dob, 65);
      expect(result).toBe('TEMPORARILY_DEFERRED');
    });

    it('should mark a donor as TEMPORARILY_DEFERRED if overage', () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 70); // 70 years old
      const result = eligibilityService.calculateEligibility(dob, 65);
      expect(result).toBe('TEMPORARILY_DEFERRED');
    });

    it('should mark a donor as TEMPORARILY_DEFERRED if underweight', () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 25); // 25 years old
      const result = eligibilityService.calculateEligibility(dob, 45); // 45 kg
      expect(result).toBe('TEMPORARILY_DEFERRED');
    });
  });

  describe('Donor Registration Pipeline', () => {
    it('should successfully register a donor, calculate rank, and update location geography', async () => {
      // Mock key values in cache to verify invalidation
      const kd = 'analytics:donors:summary:true';
      const ko = 'analytics:overview:true';
      const kdemand = 'analytics:demand:summary:true';

      await redis.set(kd, 'cached-donors');
      await redis.set(ko, 'cached-overview');
      await redis.set(kdemand, 'cached-demand');

      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 30);

      const registrationPayload = {
        fullName: 'Dr. Jane Doe',
        dob,
        gender: 'FEMALE' as const,
        weight: 60,
        bloodGroup: 'O_POS' as const,
        city: 'Vellore',
        district: 'Vellore District',
        state: 'Tamil Nadu',
        latitude: 12.9272,
        longitude: 79.1304,
        locationConsent: true,
        notificationConsent: true,
      };

      const result = await donorService.registerDonor(testUserId, registrationPayload);
      expect(result).toHaveProperty('donorId');
      expect(result.eligibility).toBe('ELIGIBLE');
      expect(typeof result.donorNumberInCity).toBe('number');

      // Verify user's name was updated
      const user = await prisma.user.findUnique({ where: { id: testUserId } });
      expect(user?.name).toBe('Dr. Jane Doe');

      // Verify geocoded PostGIS location point exists
      const rawProfile = await prisma.$queryRawUnsafe<any[]>(
        `SELECT ST_AsText(location) as locationText FROM "DonorProfile" WHERE "userId" = $1`,
        testUserId
      );
      expect(rawProfile[0].locationtext).toBe('POINT(79.1304 12.9272)');

      // Verify selective cache invalidations
      expect(await redis.get(kd)).toBeNull();
      expect(await redis.get(ko)).toBeNull();
      expect(await redis.get(kdemand)).toBe('cached-demand'); // Selective invalidation ignored demand keys

      await redis.del(kdemand);
    });

    it('should prevent duplicate registration by throwing a conflict error', async () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 30);

      const registrationPayload = {
        fullName: 'Jane Doe',
        dob,
        gender: 'FEMALE' as const,
        weight: 60,
        bloodGroup: 'O_POS' as const,
        city: 'Vellore',
        district: 'Vellore District',
        state: 'Tamil Nadu',
        latitude: 12.9272,
        longitude: 79.1304,
        locationConsent: true,
        notificationConsent: true,
      };

      // Attempt to register again for the same user
      await expect(
        donorService.registerDonor(testUserId, registrationPayload)
      ).rejects.toThrow();
    });
  });
});
