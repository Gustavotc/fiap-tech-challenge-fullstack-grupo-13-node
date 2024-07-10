import { z } from 'zod';

export enum UserRole {
  DISCENTE = 'c8044beb-61da-4e4d-b639-1b5f796e95af',
  DOCENTE = '929f32a7-ffea-4d5c-8aa8-a0f54a0a5c0c',
}

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
