import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostRepository } from '../post.repository.interface';
import { Post } from 'src/post/schemas/post.schema';

export class PostTypeormRepository implements PostRepository {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(post: Post): Promise<Post> {
    return this.postRepository.save(post);
  }

  // async findAll(params: IFindAllParams): Promise<User[]> {
  //   const { limit, page } = params;

  //   return this.usersRepository.find({
  //     relations: {
  //       role: true,
  //     },
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });
  // }

  // async findById(id: string): Promise<User | null> {
  //   return this.usersRepository.findOneBy({ id });
  // }

  // async delete(id: string): Promise<void> {
  //   await this.usersRepository.delete({ id });
  // }

  // async update(userDTO: User): Promise<IUpdateUserResponse> {
  //   const { id, name, email, role } = await this.usersRepository.save(userDTO);
  //   return { id, name, email, role };
  // }
}
