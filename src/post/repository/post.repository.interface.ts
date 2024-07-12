import { Post } from '../schemas/post.schema';

export abstract class PostRepository {
  abstract create(postDto: Post): Promise<Post>;
  // abstract findAll(params: IFindAllParams): Promise<User[]>;
  // abstract findById(id: string): Promise<User | null>;
  // abstract delete(id: string): Promise<void>;
  // abstract update(userDTO: User): Promise<IUpdateUserResponse>;
}
