import { OTPProvider } from './otp.provider.js';
import { logger } from '../../../lib/logger.js';

export class ConsoleOTPProvider implements OTPProvider {
  async sendOTP(phone: string, otp: string): Promise<void> {
    logger.info({ phone, otp }, `🔑 [DEV AUTH] Sent OTP: ${otp} to phone: ${phone}`);
  }
}
