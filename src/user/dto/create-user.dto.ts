import { z } from 'zod';

export const ROLE_KEYS = ['DISCENTE', 'DOCENTE'] as const;

export const createUserSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    role_id: z.enum(ROLE_KEYS),
    password: z.string(),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
