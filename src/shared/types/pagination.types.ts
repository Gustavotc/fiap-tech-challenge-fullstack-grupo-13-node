import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type IPaginationParams = { page: number; limit: number };
