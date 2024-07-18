import { z } from 'zod';

export const deletePostSchema = z
  .object({
    post_id: z.string().uuid(),
    user_id: z.string().uuid(),
  })
  .required();

export type DeletePostDto = z.infer<typeof deletePostSchema>;
