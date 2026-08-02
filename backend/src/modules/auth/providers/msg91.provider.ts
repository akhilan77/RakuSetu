import { OTPProvider } from './otp.provider.js';
import { logger } from '../../../lib/logger.js';

export class MSG91Provider implements OTPProvider {
  async sendOTP(phone: string, _otp: string): Promise<void> {
    logger.info({ phone }, 'MSG91 OTP dispatch requested (scaffolded integration)');
    // MSG91 REST implementation placeholder for production mode
  }
}
