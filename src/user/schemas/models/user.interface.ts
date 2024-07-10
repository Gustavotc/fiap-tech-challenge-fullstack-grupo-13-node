import { IRole } from './role.interface';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  role: IRole;
  password: string;
}
