import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository.interface';
import { User } from './schemas/user.schema';

const mockUserRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        // {
        //   provide: getRepositoryToken(User),
        //   useValue: mockUserRepository,
        // },
      ],
    }).compile();

    jest.clearAllMocks();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
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
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValueOnce(result);

      const response = await userController.findAll({
        limit: 5,
        page: 1,
      });

      expect(response).toEqual(result);
      expect(userService.findAll).toHaveBeenCalledWith({ limit: 5, page: 1 });
    });

    it('should throw an error if repository fail', async () => {
      jest.spyOn(userService, 'findAll').mockRejectedValueOnce(new Error());

      const promise = userController.findAll({
        limit: 1,
        page: 1,
      });

      await expect(promise).rejects.toStrictEqual(Error());
      expect(userService.findAll).toHaveBeenCalledWith({ limit: 1, page: 1 });
    });
  });
});
