import { z } from 'zod';

export const updatePostSchema = z
  .object({
    post_id: z.string().uuid(),
    user_id: z.string().uuid(),
    title: z.string().max(255),
    description: z.string(),
    category: z.string(),
  })
  .required();

export type UpdatePostDto = z.infer<typeof updatePostSchema>;
