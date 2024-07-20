import { faker } from '@faker-js/faker';
import { createRoleMock } from './role.mock';
import { User } from 'src/user/schemas/user.schema';

export const createUserMock = (): User => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    role: createRoleMock(),
  };
};
