import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from './repository/post.repository.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './schemas/post.schema';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { IPaginationParams } from 'src/shared/types/pagination.types';
import { DeletePostDto } from './dto/delete-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindTeacherPostsDto } from './dto/find-teacher-posts.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = new Post();

    const user = await this.userRepository.findById(createPostDto.user_id);

    if (!user || user.role.type !== 'DOCENTE')
      throw new UnauthorizedException('User unauthorized');

    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.category = createPostDto.category;
    post.user = user;

    return this.postRepository.create(post);
  }

  async findAll(params: IPaginationParams) {
    return this.postRepository.findAll(params);
  }

  async findOne(id: string) {
    const post = await this.postRepository.findById(id);

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async update(updatePostDto: UpdatePostDto) {
    const user = await this.userRepository.findById(updatePostDto.user_id);

    if (!user || user.role.type !== 'DOCENTE') {
      throw new UnauthorizedException('User unauthorized');
    }

    const post = await this.postRepository.findById(updatePostDto.post_id);

    if (!post) throw new NotFoundException('Post not found');

    if (post.user.id !== updatePostDto.user_id) {
      throw new UnauthorizedException('User unauthorized');
    }

    const updatedPost = post;
    updatedPost.title = updatePostDto.title;
    updatedPost.description = updatePostDto.description;
    updatedPost.category = updatePostDto.category;

    return this.postRepository.update(updatedPost);
  }

  async delete({ post_id, user_id }: DeletePostDto) {
    const user = await this.userRepository.findById(user_id);

    if (!user || user.role.type !== 'DOCENTE') {
      throw new UnauthorizedException('User unauthorized');
    }

    const post = await this.postRepository.findById(post_id);

    if (!post) throw new NotFoundException('Post not found');

    if (post.user.id !== user_id) {
      throw new UnauthorizedException('User unauthorized');
    }

    return this.postRepository.delete(post_id);
  }

  async findTeacherPosts(findTeacherPostsDto: FindTeacherPostsDto) {
    const { teacher_id, limit, page } = findTeacherPostsDto;

    const user = await this.userRepository.findById(teacher_id);

    if (!user || user.role.type !== 'DOCENTE') {
      throw new UnauthorizedException('User unauthorized');
    }

    return this.postRepository.findTeacherPosts({ limit, page, teacher_id });
  }

  async findByText(text: string) {
    return this.postRepository.findByText(text);
  }
}
