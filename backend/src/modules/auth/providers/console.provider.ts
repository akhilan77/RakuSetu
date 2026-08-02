import { OTPProvider } from './otp.provider.js';
import { logger } from '../../../lib/logger.js';
import { OTP_EXPIRY } from '../constants.js';

export class ConsoleProvider implements OTPProvider {
  async sendOTP(phone: string, otp: string): Promise<void> {
    logger.info({ phone, otp, expiry: OTP_EXPIRY }, `🔑 [OTP DEVELOPER LOG] Code dispatched to ${phone}: ${otp} (expires in ${OTP_EXPIRY}s)`);
  }
}
