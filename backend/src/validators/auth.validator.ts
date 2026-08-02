import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const RequestOtpSchema = z.object({
  body: z.object({
    phone: z.string().regex(phoneRegex, { message: 'Invalid phone number format (must be E.164 compatible)' }),
  }),
});

export const VerifyOtpSchema = z.object({
  body: z.object({
    phone: z.string().regex(phoneRegex, { message: 'Invalid phone number format' }),
    otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
  }),
});
export type RequestOtpInput = z.infer<typeof RequestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
