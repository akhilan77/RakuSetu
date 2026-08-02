import { OTPProvider } from './otp.provider.js';
import { ConsoleOTPProvider } from './console.provider.js';
import { MSG91OTPProvider } from './msg91.provider.js';

export class OTPProviderFactory {
  static getProvider(): OTPProvider {
    const provider = process.env.OTP_PROVIDER || 'console';
    if (provider === 'msg91') {
      return new MSG91OTPProvider();
    }
    return new ConsoleOTPProvider();
  }
}
export * from './otp.provider.js';
