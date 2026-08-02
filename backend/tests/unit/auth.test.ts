import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jwtService } from '../../src/modules/auth/jwt.service.js';
import { otpService } from '../../src/modules/auth/otp.service.js';
import { redis } from '../../src/lib/redis.js';

// Mock Redis client
vi.mock('../../src/lib/redis.js', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
  },
}));

describe('Auth Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('JWT Service', () => {
    it('should generate a secure random 64-character hex token string', () => {
      const token = jwtService.generateRandomToken();
      expect(token).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
    });

    it('should correctly sign and verify JWT access tokens', () => {
      const payload = {
        userId: 'test-user-id',
        phone: '+919999999999',
        roles: ['DONOR'],
        tokenVersion: 1,
      };

      const token = jwtService.signAccessToken(payload);
      const decoded = jwtService.verifyAccessToken(token);

      expect(decoded.sub).toBe(payload.userId);
      expect(decoded.phone).toBe(payload.phone);
      expect(decoded.roles).toContain('DONOR');
      expect(decoded.tokenVersion).toBe(1);
    });

    it('should generate consistent SHA-256 hashes', () => {
      const token = 'my-super-secret-token';
      const hash1 = jwtService.hashToken(token);
      const hash2 = jwtService.hashToken(token);
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });
  });

  describe('OTP Service', () => {
    it('should trigger rate limit errors when phone count exceeds limit', async () => {
      vi.mocked(redis.get).mockResolvedValueOnce('3'); // phoneCount = 3

      await expect(otpService.checkRateLimits('+919999999999', '127.0.0.1')).rejects.toThrow(
        /Too many OTP requests/
      );
    });

    it('should generate and store secure 6-digit OTP when none exists', async () => {
      vi.mocked(redis.get).mockResolvedValue(null); // No existing OTP or rate limits
      vi.mocked(redis.incr).mockResolvedValue(1);

      await otpService.generateAndSendOTP('+919999999999', '127.0.0.1');

      expect(redis.set).toHaveBeenCalledWith(
        'otp:login:+919999999999',
        expect.stringMatching(/^\d{6}$/),
        'EX',
        300
      );
    });
  });
});
