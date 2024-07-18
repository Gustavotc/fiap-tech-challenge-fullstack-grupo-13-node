import {
  Controller,
  Post,
  Body,
  UsePipes,
  Get,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, createPostSchema } from './dto/create-post.dto';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation-pipe';
import { ApiTags } from '@nestjs/swagger';
import {
  IPaginationParams,
  paginationSchema,
} from 'src/shared/types/pagination.types';
import { DeletePostDto, deletePostSchema } from './dto/delete-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  FindTeacherPostsDto,
  findTeacherPostsSchema,
} from './dto/find-teacher-posts.dto';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('admin')
  async findTeacherPosts(
    @Query(new ZodValidationPipe(findTeacherPostsSchema))
    findTeacherPostsDto: FindTeacherPostsDto,
  ) {
    return this.postService.findTeacherPosts(findTeacherPostsDto);
  }

  @Get('search')
  async findByText(@Query('text') text: string) {
    return this.postService.findByText(text);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createPostSchema))
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationSchema))
    query: IPaginationParams,
  ) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Put()
  async update(@Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(updatePostDto);
  }

  @Delete()
  async delete(
    @Query(new ZodValidationPipe(deletePostSchema))
    deletePostDTO: DeletePostDto,
  ) {
    return this.postService.delete(deletePostDTO);
  }
}
