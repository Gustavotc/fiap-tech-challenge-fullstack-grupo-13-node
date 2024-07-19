import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository.interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../schemas/user.schema';
import { UserTypeormRepository } from './typeorm/user.typeorm.repository';

const mockUserTypeOrmRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
};

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userTypeOrmMock;

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

  describe('findAll', () => {
    it('should return an user array', async () => {
      const users: User[] = [
        {
          id: 'id',
          email: 'email',
          name: 'name',
          password: 'password',
          role: {
            id: 'id',
            type: 'DOCENTE',
          },
        },
        {
          id: 'id2',
          email: 'email2',
          name: 'name2',
          password: 'password2',
          role: {
            id: 'id',
            type: 'DISCENTE',
          },
        },
      ];
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
});
