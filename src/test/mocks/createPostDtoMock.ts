import { faker } from '@faker-js/faker';
import { CreatePostDto } from 'src/post/dto/create-post.dto';

export const createPostDtoMock = (): CreatePostDto => {
  return {
    user_id: faker.string.uuid(),
    category: faker.lorem.word(),
    description: faker.lorem.sentence(),
    title: faker.lorem.sentence(),
  };
};
