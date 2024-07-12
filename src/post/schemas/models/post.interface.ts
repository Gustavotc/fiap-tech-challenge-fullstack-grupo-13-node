import { User } from 'src/user/schemas/user.schema';

export interface IPost {
  id?: string;
  title: string;
  description: string;
  category: string;
  createAt: Date;
  updateAt: Date;
  user: User;
}
