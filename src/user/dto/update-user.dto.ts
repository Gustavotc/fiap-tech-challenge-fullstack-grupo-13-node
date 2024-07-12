import { z } from 'zod';
import { ROLE_KEYS } from './create-user.dto';

export const updateUserSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    role_id: z.enum(ROLE_KEYS),
    password: z.string(),
  })
  .required();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const userUuidSchema = z.string().uuid();
