import crypto from 'crypto';
import { redis } from '../../lib/redis.js';
import { authKeys } from './auth.keys.js';
import { OTP_EXPIRY, MAX_ATTEMPTS } from './constants.js';
import { OTPProviderFactory } from './providers/index.js';
import { AppError } from '../../middleware/error.js';
import { ErrorCode } from '../../constants/error-codes.js';

export class OTPService {
  async checkRateLimits(phone: string, ip: string): Promise<void> {
    const phoneKey = authKeys.phoneRate(phone);
    const ipKey = authKeys.ipRate(ip);

    const phoneCount = await redis.get(phoneKey);
    if (phoneCount && parseInt(phoneCount, 10) >= 3) {
      throw new AppError(429, ErrorCode.VALIDATION_ERROR, 'Too many OTP requests for this phone number. Try again in an hour.');
    }

    const ipCount = await redis.get(ipKey);
    if (ipCount && parseInt(ipCount, 10) >= 10) {
      throw new AppError(429, ErrorCode.VALIDATION_ERROR, 'Too many OTP requests from this IP address. Try again in an hour.');
    }

    // Increment and set TTL
    const nextPhone = await redis.incr(phoneKey);
    if (nextPhone === 1) await redis.expire(phoneKey, 3600);

    const nextIp = await redis.incr(ipKey);
    if (nextIp === 1) await redis.expire(ipKey, 3600);
  }

  async generateAndSendOTP(phone: string, ip: string): Promise<void> {
    await this.checkRateLimits(phone, ip);

    const otpKey = authKeys.otpLogin(phone);
    const attemptsKey = authKeys.otpAttempts(phone);

    let otp = await redis.get(otpKey);
    
    if (!otp) {
      // Generate secure 6-digit OTP
      otp = crypto.randomInt(100000, 999999).toString();
      await redis.set(otpKey, otp, 'EX', OTP_EXPIRY);
      await redis.set(attemptsKey, '0', 'EX', OTP_EXPIRY);
    }

    const provider = OTPProviderFactory.getProvider();
    await provider.sendOTP(phone, otp);
  }

  async verifyOTP(phone: string, inputOtp: string): Promise<void> {
    const otpKey = authKeys.otpLogin(phone);
    const attemptsKey = authKeys.otpAttempts(phone);

    const otp = await redis.get(otpKey);
    if (!otp) {
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, 'OTP expired or not requested');
    }

    // Check attempts limit
    const attemptsVal = await redis.get(attemptsKey);
    const attempts = attemptsVal ? parseInt(attemptsVal, 10) : 0;
    if (attempts >= MAX_ATTEMPTS) {
      await redis.del(otpKey);
      await redis.del(attemptsKey);
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, 'Too many failed verification attempts. OTP has been invalidated.');
    }

    if (otp !== inputOtp) {
      await redis.incr(attemptsKey);
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, 'Invalid verification code');
    }

    // Clear OTP and attempts on success
    await redis.del(otpKey);
    await redis.del(attemptsKey);
  }
}
export const otpService = new OTPService();
