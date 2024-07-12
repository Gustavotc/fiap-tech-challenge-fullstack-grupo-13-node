import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, createPostSchema } from './dto/create-post.dto';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation-pipe';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createPostSchema))
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  // @Get()
  // async findAll(
  //   @Query(new ZodValidationPipe(findAllUsersSchema))
  //   query: {
  //     page: number;
  //     limit: number;
  //   },
  // ) {
  //   return this.userService.findAll(query);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.userService.delete(id);
  // }
}
