import { OTPProvider } from './otp.provider.js';
import { logger } from '../../../lib/logger.js';
import { env } from '../../../config/env.js';

export class MSG91OTPProvider implements OTPProvider {
  async sendOTP(phone: string, otp: string): Promise<void> {
    logger.info({ phone }, 'Sending OTP via MSG91 SMS gateway');
    if (!env.MSG91_KEY || !env.MSG91_TEMPLATE_ID) {
      logger.error('MSG91 configuration variables are missing. Falling back to console log.');
      logger.info(`🔑 [FALLBACK] Sent OTP: ${otp} to phone: ${phone}`);
      return;
    }
    // Integrate MSG91 REST endpoints here for production rollout
  }
}
