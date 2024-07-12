import { IRole } from './role.interface';

export enum EUserRole {
  DISCENTE = 'c8044beb-61da-4e4d-b639-1b5f796e95af',
  DOCENTE = '929f32a7-ffea-4d5c-8aa8-a0f54a0a5c0c',
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  role: IRole;
  password: string;
}
