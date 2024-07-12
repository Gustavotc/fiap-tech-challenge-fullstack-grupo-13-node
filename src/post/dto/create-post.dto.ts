import { z } from 'zod';

export const createPostSchema = z
  .object({
    title: z.string().max(255),
    description: z.string(),
    category: z.string(),
    user_id: z.string().uuid(),
  })
  .required();

export type CreatePostDto = z.infer<typeof createPostSchema>;
