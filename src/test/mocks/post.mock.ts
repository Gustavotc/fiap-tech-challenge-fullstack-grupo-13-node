import { faker } from '@faker-js/faker';
import { Post } from 'src/post/schemas/post.schema';
import { createUserMock } from './user.mock';

export const createPostMock = (): Post => {
  const createdAt = faker.date.soon();
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    category: faker.lorem.word(),
    createAt: createdAt,
    updateAt: createdAt,
    user: createUserMock(),
  };
};
