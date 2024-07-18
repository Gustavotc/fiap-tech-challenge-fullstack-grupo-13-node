import {
  Controller,
  Post,
  Body,
  UsePipes,
  Get,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation-pipe';
import {
  UpdateUserDto,
  updateUserSchema,
  userUuidSchema,
} from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import {
  IPaginationParams,
  paginationSchema,
} from 'src/shared/types/pagination.types';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationSchema))
    query: IPaginationParams,
  ) {
    return this.userService.findAll(query);
  }

  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  findOne(@Param('id', new ZodValidationPipe(userUuidSchema)) id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ZodValidationPipe(userUuidSchema)) id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ) {
    this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
