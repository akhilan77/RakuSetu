import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { redis } from '../../src/lib/redis.js';
import { prisma } from '../../src/lib/prisma.js';
import { authKeys } from '../../src/modules/auth/auth.keys.js';

describe('Auth Integration Tests', () => {
  const testPhone = '+919999999999';

  beforeAll(async () => {
    // Clear Redis rates and test phone
    await redis.del(authKeys.phoneRate(testPhone));
    await redis.del(authKeys.otpLogin(testPhone));
    await redis.del(authKeys.otpAttempts(testPhone));

    // Clear test user
    await prisma.refreshToken.deleteMany({
      where: { user: { phone: testPhone } },
    });
    await prisma.user.deleteMany({
      where: { phone: testPhone },
    });
  });

  afterAll(async () => {
    // Graceful disconnect
    await redis.del(authKeys.phoneRate(testPhone));
    await redis.del(authKeys.otpLogin(testPhone));
    await redis.del(authKeys.otpAttempts(testPhone));
  });

  it('should complete the entire authentication and rotation lifecycle successfully', async () => {
    // 1. Request OTP
    const reqOtpRes = await request(app)
      .post('/api/v1/auth/request-otp')
      .send({ phone: testPhone });
    
    expect(reqOtpRes.status).toBe(200);
    expect(reqOtpRes.body.success).toBe(true);

    // Retrieve generated OTP from Redis since sms is console-only in dev
    const otp = await redis.get(authKeys.otpLogin(testPhone));
    expect(otp).toBeDefined();

    // 2. Verify OTP and login
    const verifyRes = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ phone: testPhone, otp });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.data.accessToken).toBeDefined();
    expect(verifyRes.body.data.refreshToken).toBeDefined();

    const accessToken = verifyRes.body.data.accessToken;
    const refreshToken = verifyRes.body.data.refreshToken;

    // 3. Request GET /me with Bearer token
    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.user.phone).toBe(testPhone);

    // 4. Rotate/Refresh tokens
    const refreshRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data.accessToken).toBeDefined();
    expect(refreshRes.body.data.refreshToken).toBeDefined();

    const newAccessToken = refreshRes.body.data.accessToken;
    const newRefreshToken = refreshRes.body.data.refreshToken;

    // Verify new token works
    const meRes2 = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${newAccessToken}`);

    expect(meRes2.status).toBe(200);
    expect(meRes2.body.data.user.phone).toBe(testPhone);

    // 5. Logout
    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken: newRefreshToken });

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    // 6. Refreshing again with revoked token should fail
    const refreshFailRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: newRefreshToken });

    expect(refreshFailRes.status).toBe(401);
    expect(refreshFailRes.body.success).toBe(false);
  });
});
