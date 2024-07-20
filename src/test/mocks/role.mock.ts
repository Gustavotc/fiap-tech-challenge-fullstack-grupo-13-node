import { faker } from '@faker-js/faker';
import { IRole } from 'src/user/schemas/models/role.interface';
import { EUserRole } from 'src/user/schemas/models/user.interface';

export const createRoleMock = (): IRole => {
  return faker.helpers.arrayElement<IRole>([
    { id: EUserRole.DOCENTE, type: 'DOCENTE' },
    { id: EUserRole.DISCENTE, type: 'DISCENTE' },
  ]);
};
