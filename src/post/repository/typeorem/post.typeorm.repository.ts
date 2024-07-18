import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { PostRepository } from '../post.repository.interface';
import { Post } from 'src/post/schemas/post.schema';
import { IPaginationParams } from 'src/shared/types/pagination.types';
import { FindTeacherPostsDto } from 'src/post/dto/find-teacher-posts.dto';

export class PostTypeormRepository implements PostRepository {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(post: Post): Promise<Post> {
    return this.postRepository.save(post);
  }

  async findAll(params: IPaginationParams): Promise<Post[]> {
    const { limit, page } = params;

    return this.postRepository.find({
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findTeacherPosts(params: FindTeacherPostsDto) {
    const { teacher_id, page, limit } = params;

    return this.postRepository.find({
      where: {
        user: { id: teacher_id },
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<Post | null> {
    return this.postRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
        },
      },
    });
  }

  findByText(text: string): Promise<Post[]> {
    return this.postRepository.find({
      where: [
        {
          title: ILike(`%${text}%`),
        },
        { description: ILike(`%${text}%`) },
      ],
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.postRepository.delete({ id });
  }

  async update(post: Post): Promise<Post> {
    return this.postRepository.save(post);
  }
}
