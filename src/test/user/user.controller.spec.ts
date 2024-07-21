import { Test } from '@nestjs/testing';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { User } from 'src/user/schemas/user.schema';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { createUserMock } from '../mocks/user.mock';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

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

  describe('create', () => {
    it('should create and return an user', async () => {

      const createUserDto: CreateUserDto = {
        name: 'Julio Test',
        email: 'julio@test.com',
        password: 'password',
        role_id: 'DISCENTE'
      };

      const user: User = createUserMock();

      jest.spyOn(userService, 'create').mockResolvedValueOnce(user);

      const response = await userController.create(createUserDto)

      expect(response).toStrictEqual(user);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if repository fail', async () => {
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());

      const createUserDto: CreateUserDto = {
        name: 'Julio Test',
        email: 'julio@test.com',
        password: 'password',
        role_id: 'DISCENTE'
      };

      const promise = userController.create(createUserDto);

      await expect(promise).rejects.toStrictEqual(Error());
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      const result: User = createUserMock();
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(result);

      const userId = '648ffb64-1e2f-4091-8877-28a76e48b287';
      const response = await userController.findOne(userId);

      expect(response).toEqual(result);
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(userService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if repository fail', async () => {
      jest.spyOn(userService, 'findOne').mockRejectedValueOnce(new Error());

      const userId = '648ffb64-1e2f-4091-8877-28a76e48b287';
      const promise = userController.findOne(userId);

      await expect(promise).rejects.toStrictEqual(Error());
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(userService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should throw a NotFoundException when the user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockRejectedValue(new NotFoundException('User not found'));

      await expect(userService.findOne('1')).rejects.toThrow(NotFoundException);
      expect(userService.findOne).toHaveBeenCalledWith('1');
    });
  });


  describe('update', () => {
    it('should update and return an user', async () => {

      const userId = '648ffb64-1e2f-4091-8877-28a76e48b287';
      const user: User = createUserMock();
      user.id = userId;

      jest.spyOn(userService, 'update').mockResolvedValueOnce(user);

      const updateUserDto: UpdateUserDto = {
        name: 'Julio Test',
        email: 'julio@test.com',
        role_id: 'DISCENTE',
        password: 'password',
      };

      userController.update(userId, updateUserDto);

      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
    });

    it('should throw a NotFoundException when the user is not found', async () => {
      jest.spyOn(userService, 'update').mockRejectedValue(new NotFoundException('User not found'));

      const userId = '648ffb64-1e2f-4091-8877-28a76e48b287';
      const userUpdateDto: UpdateUserDto = {
        name: 'Julio Test',
        email: 'julio@test.com',
        role_id: 'DISCENTE',
        password: 'password',
      }

      await expect(userService.update(userId, userUpdateDto)).rejects.toThrow(NotFoundException);
      expect(userService.update).toHaveBeenCalledWith(userId, userUpdateDto);
    });
  });

  describe('delete', () => {
    it('should delete an user', async () => {

      const userId = '648ffb64-1e2f-4091-8877-28a76e48b287';
      jest.spyOn(userService, 'delete').mockResolvedValueOnce();

      await userController.delete(userId);

      expect(userService.delete).toHaveBeenCalledTimes(1);
      expect(userService.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw a NotFoundException when the user is not found', async () => {
      const userId = '648ffb64-1e2f-4091-8877-28a76e48b287';
      jest.spyOn(userService, 'delete').mockRejectedValue(new NotFoundException('User not found'));

      await expect(userController.delete(userId)).rejects.toThrow(NotFoundException);
      expect(userService.delete).toHaveBeenCalledWith(userId);
    });
  });
});
