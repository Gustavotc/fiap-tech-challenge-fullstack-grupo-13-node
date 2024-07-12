import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository.interface';

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

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [];
      jest.spyOn(userService, 'findAll').mockResolvedValueOnce(result);

      const response = await userController.findAll({
        limit: 5,
        page: 1,
      });

      expect(response).toBe(result);
      expect(userService.findAll).toHaveBeenCalledWith({ limit: 5, page: 1 });
    });
  });
});
