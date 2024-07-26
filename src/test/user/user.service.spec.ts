import { Test } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { createUserMock } from '../mocks/user.mock';
import { NotFoundException } from '@nestjs/common';
import { EUserRole } from 'src/user/schemas/models/user.interface';

const mockUserRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role_id: 'DOCENTE',
      };

      const user = createUserMock();
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = createUserDto.password;
      user.role.id = EUserRole[createUserDto.role_id];
      user.role.type = createUserDto.role_id;

      jest.spyOn(mockUserRepository, 'create').mockResolvedValueOnce(user);

      const result = await userService.create(createUserDto);

      expect(result).toEqual(user);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        role: {
          id: user.role.id,
          type: createUserDto.role_id,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [createUserMock()];
      const params = { limit: 5, page: 1 };

      jest.spyOn(mockUserRepository, 'findAll').mockResolvedValueOnce(users);

      const result = await userService.findAll(params);

      expect(result).toEqual(users);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = createUserMock();
      const userId = 'user1';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);

      const result = await userService.findOne(userId);

      expect(result).toEqual(user);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'user1';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(null);

      await expect(userService.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'newpassword',
        role_id: 'DISCENTE',
      };

      const user = createUserMock();
      const userId = 'user1';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(mockUserRepository, 'update').mockResolvedValueOnce(user);

      const result = await userService.update(userId, updateUserDto);

      expect(result).toEqual(user);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ...user,
          name: updateUserDto.name,
          email: updateUserDto.email,
          password: updateUserDto.password,
          role: expect.objectContaining({
            id: user.role.id,
            type: updateUserDto.role_id,
          }),
        }),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'newpassword',
        role_id: 'DISCENTE',
      };
      const userId = 'user1';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(null);

      await expect(userService.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = createUserMock();
      const userId = 'user1';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(mockUserRepository, 'delete').mockResolvedValueOnce(undefined);

      const result = await userService.delete(userId);

      expect(result).toBeUndefined();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'user1';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(null);

      await expect(userService.delete(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });
});
