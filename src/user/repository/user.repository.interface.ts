import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../user.entity';

export interface IUserRepository {
  create(userDTO: CreateUserDto): Promise<User>;
}
