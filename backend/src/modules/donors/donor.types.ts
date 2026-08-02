import { z } from 'zod';
import { BloodGroup, Gender } from '@prisma/client';

export const createDonorSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  dob: z.coerce.date({ required_error: 'Date of birth is required' }),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: 'Invalid gender value' }) }),
  weight: z.number().min(30).max(200, { message: 'Weight must be between 30 and 200 kg' }),
  bloodGroup: z.nativeEnum(BloodGroup, { errorMap: () => ({ message: 'Invalid blood group value' }) }),
  city: z.string().min(2, { message: 'City is required' }),
  district: z.string().min(2, { message: 'District is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  latitude: z.number(),
  longitude: z.number(),
  locationConsent: z.boolean(),
  notificationConsent: z.boolean(),
});

export const updateDonorSchema = createDonorSchema.partial();

export type CreateDonorInput = z.infer<typeof createDonorSchema>;
export type UpdateDonorInput = z.infer<typeof updateDonorSchema>;
