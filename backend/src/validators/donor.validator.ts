import { z } from 'zod';
import { DonorSchema } from '@raktsetu/shared';

export const CreateDonorValidator = z.object({
  body: DonorSchema.omit({ id: true }),
});

export const UpdateDonorAvailabilityValidator = z.object({
  body: z.object({
    status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'SNOOZED', 'INELIGIBLE', 'UNCONFIRMED']),
    snoozeUntil: z.string().datetime().optional().nullable(),
  }),
});
