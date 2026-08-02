export const authKeys = {
  otpLogin: (phone: string) => `otp:login:${phone}`,
  otpAttempts: (phone: string) => `otp:attempts:${phone}`,
  phoneRate: (phone: string) => `rate:otp:phone:${phone}`,
  ipRate: (ip: string) => `rate:otp:ip:${ip}`,
};
