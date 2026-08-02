import { z } from 'zod';
import { RequestSchema } from '@raktsetu/shared';

export const CreateRequestValidator = z.object({
  body: RequestSchema.omit({ id: true }),
});

export const SearchDonorsValidator = z.object({
  query: z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    radiusKm: z.coerce.number().positive().default(10),
    bloodGroup: z.enum(['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG']).optional(),
  }),
});
