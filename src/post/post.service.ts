import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './repository/post.repository.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './schemas/post.schema';
import { UserRepository } from 'src/user/repository/user.repository.interface';
// import { User } from './schemas/user.schema';
// import {
//   IFindAllParams,
//   UserRepository,
// } from './repository/user.repository.interface';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = new Post();

    const user = await this.userRepository.findById(createPostDto.user_id);

    if (!user) throw new NotFoundException('User not found');

    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.category = createPostDto.category;
    post.user = user;

    return this.postRepository.create(post);
  }

  // async findAll(params: IFindAllParams) {
  //   return this.userRepository.findAll(params);
  // }

  // async findOne(id: string) {
  //   const user = await this.userRepository.findById(id);

  //   if (!user) throw new NotFoundException('User not found');

  //   return user;
  // }

  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   const user = await this.userRepository.findById(id);

  //   if (!user) throw new NotFoundException('User not found');

  //   const { name, email, password, role_id } = updateUserDto;

  //   const updatedUser = user;
  //   updatedUser.name = name;
  //   updatedUser.email = email;
  //   updatedUser.password = password;
  //   updatedUser.role = {
  //     id: UserRole[role_id],
  //     type: role_id,
  //   };

  //   return this.userRepository.update(user);
  // }

  // async delete(id: string) {
  //   const user = await this.userRepository.findById(id);

  //   if (!user) throw new NotFoundException('User not found');

  //   return this.userRepository.delete(id);
  // }
}
