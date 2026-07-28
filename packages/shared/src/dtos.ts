import { z } from 'zod';
import { BloodGroup } from './blood-group.js';

// Reusable regex pattern for phone numbers (basic E.164 or common formats)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

/**
 * Zod validation schema for a Donor.
 */
export const DonorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z
    .string()
    .regex(phoneRegex, { message: 'Invalid phone number format (must be E.164 compatible)' }),
  bloodGroup: z.nativeEnum(BloodGroup, { errorMap: () => ({ message: 'Invalid blood group' }) }),
  age: z
    .number()
    .int()
    .min(18, { message: 'Donor must be at least 18 years old' })
    .max(65, { message: 'Donor must be under 65 years old' }),
  lastDonatedAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().default(true),
});

/**
 * TypeScript type inferred from DonorSchema.
 */
export type DonorDTO = z.infer<typeof DonorSchema>;

/**
 * Zod validation schema for a Donation Request.
 */
export const RequestSchema = z.object({
  id: z.string().uuid().optional(),
  recipientName: z
    .string()
    .min(2, { message: 'Recipient name must be at least 2 characters long' }),
  bloodGroup: z.nativeEnum(BloodGroup, { errorMap: () => ({ message: 'Invalid blood group' }) }),
  unitsRequired: z.number().int().positive({ message: 'Units required must be at least 1 unit' }),
  hospitalName: z.string().min(3, { message: 'Hospital name must be at least 3 characters long' }),
  contactPhone: z.string().regex(phoneRegex, { message: 'Invalid phone number format' }),
  status: z.enum(['PENDING', 'FULFILLED', 'CANCELLED']).default('PENDING'),
  requiredBy: z.string().datetime({ message: 'Must be a valid ISO 8601 date-time string' }),
});

/**
 * TypeScript type inferred from RequestSchema.
 */
export type RequestDTO = z.infer<typeof RequestSchema>;
