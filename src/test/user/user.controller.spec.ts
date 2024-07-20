import { Test } from '@nestjs/testing';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { User } from 'src/user/schemas/user.schema';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { createUserMock } from '../mocks/user.mock';

const mockUserRepository = {};

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
      ],
    }).compile();

    jest.clearAllMocks();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = Array.from({ length: 3 }, createUserMock);

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
