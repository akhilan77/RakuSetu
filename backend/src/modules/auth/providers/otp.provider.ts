import { env } from '../../../config/env.js';
import { ConsoleProvider } from './console.provider.js';
import { MSG91Provider } from './msg91.provider.js';

export interface OTPProvider {
  sendOTP(phone: string, otp: string): Promise<void>;
}

export class OTPProviderFactory {
  static getProvider(): OTPProvider {
    const providerType = env.OTP_PROVIDER;
    
    if (providerType === 'msg91') {
      return new MSG91Provider();
    }
    
    return new ConsoleProvider();
  }
}
