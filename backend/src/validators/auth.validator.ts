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

export const LoginSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, { message: 'Phone or email is required' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  }),
});

export type RequestOtpInput = z.infer<typeof RequestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

