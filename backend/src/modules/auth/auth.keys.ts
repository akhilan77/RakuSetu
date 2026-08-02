export const authKeys = {
  OTP: (phone: string) => `otp:login:${phone}`,
  OTP_ATTEMPTS: (phone: string) => `otp:attempts:${phone}`,
  PHONE_RATE: (phone: string) => `rate:otp:phone:${phone}`,
  IP_RATE: (ip: string) => `rate:otp:ip:${ip}`,
};
