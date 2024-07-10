import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import {
  IFindAllParams,
  UserRepository,
} from './repository/user.repository.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();

    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.role = {
      id: UserRole[createUserDto.role_id],
      type: createUserDto.role_id,
    };

    return this.userRepository.create(user);
  }

  async findAll(params: IFindAllParams) {
    return this.userRepository.findAll(params);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');

    const { name, email, password, role_id } = updateUserDto;

    const updatedUser = user;
    updatedUser.name = name;
    updatedUser.email = email;
    updatedUser.password = password;
    updatedUser.role = {
      id: UserRole[role_id],
      type: role_id,
    };

    return this.userRepository.update(user);
  }

  async delete(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return this.userRepository.delete(id);
  }
}
