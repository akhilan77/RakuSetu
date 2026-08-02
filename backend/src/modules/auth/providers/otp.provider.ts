export interface OTPProvider {
  sendOTP(phone: string, otp: string): Promise<void>;
}
