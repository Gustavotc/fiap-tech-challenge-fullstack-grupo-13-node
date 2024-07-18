import { IPaginationParams } from 'src/shared/types/pagination.types';
import { Post } from '../schemas/post.schema';
import { FindTeacherPostsDto } from '../dto/find-teacher-posts.dto';

export abstract class PostRepository {
  abstract create(postDto: Post): Promise<Post>;
  abstract findAll(params: IPaginationParams): Promise<Post[]>;
  abstract findById(id: string): Promise<Post | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(post: Post): Promise<Post>;
  abstract findTeacherPosts(params: FindTeacherPostsDto): Promise<Post[]>;
  abstract findByText(text: string): Promise<Post[]>;
}
