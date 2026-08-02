import { env } from './env.js';

export const appConfig = {
  env: env.NODE_ENV,
  port: env.PORT,
  jwt: {
    secret: env.JWT_SECRET,
    accessTokenExpiry: '8h',
    refreshTokenExpiry: '7d',
  },
  cors: {
    origins: env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    otpMax: 3, // Max 3 OTP requests per phone number per hour
    otpWindowMs: 60 * 60 * 1000,
  },
  apiPrefix: '/api/v1',
};
