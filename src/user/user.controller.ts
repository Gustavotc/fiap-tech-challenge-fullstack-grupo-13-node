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
import { UpdateUserDto } from './dto/update-user.dto';
import { z } from 'zod';

const findAllUsersSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(findAllUsersSchema))
    query: {
      page: number;
      limit: number;
    },
  ) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
