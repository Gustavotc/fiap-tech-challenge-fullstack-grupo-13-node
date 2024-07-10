import { User } from '../schemas/user.schema';

export type IFindAllParams = {
  page: number;
  limit: number;
};

export type IUpdateUserResponse = Omit<User, 'password'>;

export abstract class UserRepository {
  abstract create(userDTO: User): Promise<User>;
  abstract findAll(params: IFindAllParams): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(userDTO: User): Promise<IUpdateUserResponse>;
}
