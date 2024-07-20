import { Test } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { createUserMock } from 'src/test/mocks/user.mock';
import { UserTypeormRepository } from 'src/user/repository/typeorm/user.typeorm.repository';
import {
  UserRepository,
  IUpdateUserResponse,
} from 'src/user/repository/user.repository.interface';
import { User } from 'src/user/schemas/user.schema';

const mockUserTypeOrmRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userTypeOrmMock: typeof mockUserTypeOrmRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserTypeormRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserTypeOrmRepository,
        },
      ],
    }).compile();

    jest.clearAllMocks();

    userRepository = moduleRef.get<UserRepository>(UserTypeormRepository);
    userTypeOrmMock = moduleRef.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should save user in database', async () => {
      const user = createUserMock();

      userTypeOrmMock.save.mockResolvedValueOnce(user);

      const response = await userRepository.create(user);

      expect(response).toEqual(user);
      expect(userTypeOrmMock.save).toHaveBeenCalledTimes(1);
      expect(userTypeOrmMock.save).toHaveBeenCalledWith(user);
    });

    it('should throw if database save fail', async () => {
      const user = createUserMock();

      userTypeOrmMock.save.mockRejectedValueOnce(new Error());

      const promise = userRepository.create(user);

      await expect(promise).rejects.toEqual(Error());
      expect(userTypeOrmMock.save).toHaveBeenCalledTimes(1);
      expect(userTypeOrmMock.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findAll', () => {
    it('should return an user array', async () => {
      const users: User[] = Array.from({ length: 5 }, createUserMock);
      userTypeOrmMock.find.mockResolvedValueOnce(users);

      const page = 1;
      const limit = 10;

      const response = await userRepository.findAll({
        limit,
        page,
      });

      expect(response).toEqual(users);
      expect(userTypeOrmMock.find).toHaveBeenCalledTimes(1);
      expect(userTypeOrmMock.find).toHaveBeenCalledWith({
        relations: {
          role: true,
        },
        skip: (page - 1) * limit,
        take: 10,
      });
    });

    it('should throw if database access fail', async () => {
      userTypeOrmMock.find.mockRejectedValueOnce(new Error());

      const page = 1;
      const limit = 10;

      const promise = userRepository.findAll({
        limit,
        page,
      });

      await expect(promise).rejects.toEqual(Error());
      expect(userTypeOrmMock.find).toHaveBeenCalledTimes(1);
      expect(userTypeOrmMock.find).toHaveBeenCalledWith({
        relations: {
          role: true,
        },
        skip: (page - 1) * limit,
        take: 10,
      });
    });
  });

  describe('findById', () => {
    it('should return a user by id if it exists in database', async () => {
      const user: User = createUserMock();
      userTypeOrmMock.findOne.mockResolvedValueOnce(user);

      const id = 'userId';

      const response = await userRepository.findById(id);

      expect(response).toEqual(user);
      expect(userTypeOrmMock.findOne).toHaveBeenCalledTimes(1);
      expect(userTypeOrmMock.findOne).toHaveBeenCalledWith({
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
    });

    it('should return null if user does not exist in database', async () => {
      userTypeOrmMock.findOne.mockResolvedValueOnce(null);

      const id = 'userId';

      const response = await userRepository.findById(id);

      expect(response).toBeNull();
      expect(userTypeOrmMock.findOne).toHaveBeenCalledTimes(1);
      expect(userTypeOrmMock.findOne).toHaveBeenCalledWith({
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
    });

    it('should throw if database access fail', async () => {
      userTypeOrmMock.findOne.mockRejectedValueOnce(new Error());

      const id = 'userId';

      const promise = userRepository.findById(id);

      await expect(promise).rejects.toEqual(Error());
    });
  });

  describe('delete', () => {
    it('should delete user in database', async () => {
      userTypeOrmMock.delete.mockImplementationOnce(jest.fn);

      await userRepository.delete('userId');

      expect(userTypeOrmMock.delete).toHaveBeenCalledTimes(1);
      expect(userTypeOrmMock.delete).toHaveBeenCalledWith({ id: 'userId' });
    });
  });

  describe('update', () => {
    it('should update user in database', async () => {
      const user = createUserMock();
      userTypeOrmMock.save.mockResolvedValueOnce(user);

      const response = await userRepository.update(user);

      const expectedResponse: IUpdateUserResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      expect(response).toEqual(expectedResponse);
      expect(userTypeOrmMock.save).toHaveBeenCalledTimes(1);
      expect(userTypeOrmMock.save).toHaveBeenCalledWith(user);
    });
  });
});
