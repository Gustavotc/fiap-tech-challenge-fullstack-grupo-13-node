import { paginationSchema } from 'src/shared/types/pagination.types';
import { z } from 'zod';

export const findTeacherPostsSchema = z
  .object({
    teacher_id: z.string().uuid(),
  })
  .merge(paginationSchema)
  .required();

export type FindTeacherPostsDto = z.infer<typeof findTeacherPostsSchema>;
