/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let userModel: Model<User>;

  const ModelToken = getModelToken(User.name);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: ModelToken,
          useFactory: () => ({
            create: jest.fn(),
            find: jest.fn(),
            countDocuments: jest.fn(),
            findOneAndDelete: jest.fn(),
            findOneAndUpdate: jest.fn(),
          }),
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(ModelToken);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('addNewUser', () => {
    it('should add a new user', async () => {
      const newUser: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const createdUser = {
        ...newUser,
        _id: 'someId',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, 'addUser').mockResolvedValue(createdUser);

      const result = await usersController.addNewUser(newUser);
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException when email is already in use', async () => {
      const newUser: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      jest
        .spyOn(usersService, 'addUser')
        .mockRejectedValue(new Error('Email Already In Use'));

      try {
        await usersController.addNewUser(newUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('Email Already In Use');
      }
    });
  });

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      const query = {
        page: '1',
        size: '5',
        search: '',
        orderBy: 'createdAt',
        order: 'asc',
      };
      const users = [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          createdAt: '2023-07-16T12:00:00.000Z',
          updatedAt: '2023-07-16T12:00:00.000Z',
        },
        {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'janedoe@example.com',
          createdAt: '2023-07-18T12:00:00.000Z',
          updatedAt: '2023-07-18T12:00:00.000Z',
        },
      ];
      const count = users.length;

      jest.spyOn(usersService, 'getUsers').mockResolvedValue({ users, count });

      const result = await usersController.getAllUsers(query);
      expect(result).toEqual({ users, count });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 'someId';
      const updateUserDto: UpdateUserDto = {
        firstName: 'UpdatedJohn',
        lastName: 'UpdatedDoe',
        email: 'UpdatedEmail',
      };

      const updatedUser = {
        ...updateUserDto,
        _id: userId,
        email: 'john@example.com',
        createdAt: new Date(),
      };
      jest.spyOn(usersService, 'updateUser').mockResolvedValue(updatedUser);

      const result = await usersController.updateUser(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException when email is already in use', async () => {
      const userId = 'someId';
      const updateUserDto: UpdateUserDto = {
        firstName: 'UpdatedJohn',
        lastName: 'UpdatedDoe',
        email: 'UpdatedEmail',
      };

      jest
        .spyOn(usersService, 'updateUser')
        .mockRejectedValue(new Error('Email Already In Use'));

      try {
        await usersController.updateUser(userId, updateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('Email Already In Use');
      }
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const userId = 'someId';
      const deletedUser = {
        _id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: new Date(),
      };
      jest.spyOn(usersService, 'deleteUser').mockResolvedValue(deletedUser);

      const result = await usersController.removeUser(userId);
      expect(result).toEqual(deletedUser);
    });
  });
});
