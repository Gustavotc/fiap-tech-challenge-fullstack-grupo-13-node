export enum UserRole {
  DISCENTE = 'c8044beb-61da-4e4d-b639-1b5f796e95af',
  DOCENTE = '929f32a7-ffea-4d5c-8aa8-a0f54a0a5c0c',
}

export class CreateUserDto {
  name: string;
  email: string;
  role_id: keyof typeof UserRole;
  password: string;
}
