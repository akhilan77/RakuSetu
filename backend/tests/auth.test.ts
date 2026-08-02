import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { redis } from '../src/lib/redis.js';
import { prisma } from '../src/lib/prisma.js';
import { otpService } from '../src/modules/auth/otp.service.js';
import { jwtService } from '../src/modules/auth/jwt.service.js';
import { authService } from '../src/modules/auth/auth.service.js';
import { authRepository } from '../src/modules/auth/auth.repository.js';
import { authKeys } from '../src/modules/auth/auth.keys.js';

describe('Authentication Unit & Integration Tests', () => {
  const testPhone = '+918888888888';

  beforeAll(async () => {
    // Clear test states
    await redis.del(authKeys.OTP(testPhone));
    await redis.del(authKeys.OTP_ATTEMPTS(testPhone));
    await redis.del(authKeys.PHONE_RATE(testPhone));
    // Clear test user
    const existing = await prisma.user.findUnique({ where: { phone: testPhone } });
    if (existing) {
      await prisma.user.delete({ where: { id: existing.id } });
    }
  });

  afterAll(async () => {
    // Cleanup connections
    await redis.del(authKeys.OTP(testPhone));
    await redis.del(authKeys.OTP_ATTEMPTS(testPhone));
    await redis.del(authKeys.PHONE_RATE(testPhone));
    
    const existing = await prisma.user.findUnique({ where: { phone: testPhone } });
    if (existing) {
      await prisma.user.delete({ where: { id: existing.id } });
    }
    
    await redis.quit();
    await prisma.$disconnect();
  });

  describe('OTP Service', () => {
    it('should generate a secure 6-digit numeric OTP and save to Redis', async () => {
      await otpService.sendOTP(testPhone);
      const cachedOtp = await redis.get(authKeys.OTP(testPhone));
      
      expect(cachedOtp).toBeDefined();
      expect(cachedOtp).toHaveLength(6);
      expect(/^\d+$/.test(cachedOtp!)).toBe(true);
    });

    it('should lock out and invalidate OTP after 5 failed verification attempts', async () => {
      // 5 failed attempts
      for (let i = 0; i < 5; i++) {
        try {
          const success = await otpService.verifyOTP(testPhone, '000000');
          expect(success).toBe(false);
        } catch (err: any) {
          // Expected AppError on final lockout try
          expect(err.statusCode).toBe(400);
        }
      }

      // Verifying it was deleted
      const cachedOtp = await redis.get(authKeys.OTP(testPhone));
      expect(cachedOtp).toBeNull();
    });

    it('should fail verification if OTP has expired in Redis', async () => {
      await otpService.sendOTP(testPhone);
      // Simulate expiry by removing OTP key
      await redis.del(authKeys.OTP(testPhone));

      await expect(otpService.verifyOTP(testPhone, '123456')).rejects.toThrow();
    });
  });

  describe('JWT Service', () => {
    it('should generate access tokens containing token version and correct payload', () => {
      const payload = {
        userId: 'test-user-id',
        phone: testPhone,
        roles: ['DONOR'],
        tokenVersion: 1,
      };

      const token = jwtService.generateAccessToken(payload);
      const verified = jwtService.verifyAccessToken(token);

      expect(verified.sub).toBe(payload.userId);
      expect(verified.phone).toBe(payload.phone);
      expect(verified.tokenVersion).toBe(payload.tokenVersion);
    });
  });

  describe('Auth Integration Flow', () => {
    it('should execute full login, refresh, and logout lifecycle', async () => {
      // 1. Dispatch OTP
      await authService.requestOtp(testPhone);
      const otp = await redis.get(authKeys.OTP(testPhone));
      expect(otp).toBeDefined();

      // 2. Verify OTP -> login
      const loginRes = await authService.verifyOtp(testPhone, otp!);
      expect(loginRes.accessToken).toBeDefined();
      expect(loginRes.refreshToken).toBeDefined();
      expect(loginRes.user.phone).toBe(testPhone);

      // 2.5 Verification: Verify successful login created audit log records
      const auditLogs = await prisma.auditLog.findMany({
        where: { actorId: loginRes.user.id },
      });
      const actions = auditLogs.map((log) => log.action);
      expect(actions).toContain('OTP_VERIFIED');
      expect(actions).toContain('USER_LOGGED_IN');

      const oldRefreshToken = loginRes.refreshToken;

      // 3. Refresh token rotation
      const refreshRes = await authService.refreshTokens(oldRefreshToken);
      expect(refreshRes.accessToken).toBeDefined();
      expect(refreshRes.refreshToken).toBeDefined();
      expect(refreshRes.refreshToken).not.toBe(oldRefreshToken);

      const newRefreshToken = refreshRes.refreshToken;

      // 3.5 Verification: Re-using the OLD rotated refresh token must fail (401)
      await expect(authService.refreshTokens(oldRefreshToken)).rejects.toThrow();

      // 4. Me endpoint profile retrieval
      const verifiedPayload = jwtService.verifyAccessToken(refreshRes.accessToken);
      const meDetails = await authService.getMe(verifiedPayload.sub);
      expect(meDetails.phone).toBe(testPhone);

      // 5. Logout session revocation
      await authService.logout(newRefreshToken);

      // 6. Refreshing with logged out token should fail
      await expect(authService.refreshTokens(newRefreshToken)).rejects.toThrow();
    });
  });
});
