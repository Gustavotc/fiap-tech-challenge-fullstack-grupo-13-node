import { User } from 'src/user/schemas/user.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IFindAllParams,
  IUpdateUserResponse,
  UserRepository,
} from '../user.repository.interface';

export class UserTypeormRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findAll(params: IFindAllParams): Promise<User[]> {
    const { limit, page } = params;

    return this.usersRepository.find({
      relations: {
        role: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: {
        role: true,
      },
      select: {
        role: {
          type: true,
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete({ id });
  }

  async update(user: User): Promise<IUpdateUserResponse> {
    const { id, name, email, role } = await this.usersRepository.save(user);
    return { id, name, email, role };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: {
        role: true,
      },
      select: {
        role: {
          id: true,
          type: true,
        },
      },
    });
  }
}
