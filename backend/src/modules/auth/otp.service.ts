import crypto from 'crypto';
import { redis } from '../../lib/redis.js';
import { authKeys } from './auth.keys.js';
import { OTP_EXPIRY, MAX_ATTEMPTS } from './constants.js';
import { OTPProviderFactory } from './providers/otp.provider.js';
import { AppError } from '../../middleware/error.js';
import { ErrorCode } from '../../constants/error-codes.js';

export class OTPService {
  async sendOTP(phone: string): Promise<void> {
    const otpKey = authKeys.OTP(phone);
    const attemptsKey = authKeys.OTP_ATTEMPTS(phone);

    // Idempotent OTP: reuse existing unexpired OTP if present
    let otp = await redis.get(otpKey);
    let ttl = await redis.ttl(otpKey);

    if (!otp || ttl <= 0) {
      // Generate secure 6-digit OTP
      otp = crypto.randomInt(100000, 999999).toString();
      await redis.set(otpKey, otp, 'EX', OTP_EXPIRY);
      await redis.set(attemptsKey, 0, 'EX', OTP_EXPIRY);
    }

    const provider = OTPProviderFactory.getProvider();
    await provider.sendOTP(phone, otp);
  }

  async verifyOTP(phone: string, inputOtp: string): Promise<boolean> {
    const otpKey = authKeys.OTP(phone);
    const attemptsKey = authKeys.OTP_ATTEMPTS(phone);

    const attemptsStr = await redis.get(attemptsKey);
    if (attemptsStr === null) {
      throw new AppError(400, ErrorCode.BAD_REQUEST, 'OTP has expired or is invalid');
    }

    const attempts = parseInt(attemptsStr, 10);
    if (attempts >= MAX_ATTEMPTS) {
      await redis.del(otpKey);
      await redis.del(attemptsKey);
      throw new AppError(400, ErrorCode.BAD_REQUEST, 'Too many verification attempts. OTP has been invalidated.');
    }

    const cachedOtp = await redis.get(otpKey);
    if (!cachedOtp) {
      throw new AppError(400, ErrorCode.BAD_REQUEST, 'OTP has expired or is invalid');
    }

    if (cachedOtp !== inputOtp) {
      const currentAttempts = await redis.incr(attemptsKey);
      if (currentAttempts >= MAX_ATTEMPTS) {
        await redis.del(otpKey);
        await redis.del(attemptsKey);
        throw new AppError(400, ErrorCode.BAD_REQUEST, 'Too many verification attempts. OTP has been invalidated.');
      }
      return false;
    }

    // Clear OTP states immediately upon successful match
    await redis.del(otpKey);
    await redis.del(attemptsKey);
    return true;
  }
}
export const otpService = new OTPService();
