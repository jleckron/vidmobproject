// src/__tests__/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<User>;

  const mockUserModel = () => ({
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useFactory: mockUserModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('addUser', () => {
    it('should add a new user', async () => {
      const newUser: User = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      const savedUser = { ...newUser, _id: 'randomId' };
      (userModel.create as jest.Mock).mockResolvedValue(savedUser);

      const result = await usersService.addUser(newUser);
      expect(result).toEqual(savedUser);
      expect(userModel.create).toHaveBeenCalledWith(newUser);
    });
  });

  describe('getUsers', () => {
    it('should return a list of users with count', async () => {
      const mockQuery = {
        search: 'John',
        size: '5',
        page: '0',
        sortBy: 'createdAt',
        order: 'asc',
      };
      const expectedSearchParam = {
        $or: [
          { firstName: { $regex: mockQuery.search, $options: 'i' } },
          { lastName: { $regex: mockQuery.search, $options: 'i' } },
          { email: { $regex: mockQuery.search, $options: 'i' } },
        ],
      };
      const expectedUsers = [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      ];
      const expectedCount = 1;

      (userModel.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(expectedUsers),
      });

      (userModel.find as jest.Mock).mockReturnValueOnce({
        countDocuments: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(expectedCount),
      });

      const result = await usersService.getUsers(mockQuery);

      expect(result).toEqual({ users: expectedUsers, count: expectedCount });
      expect(userModel.find).toHaveBeenCalledWith(expectedSearchParam);
    });
  });
  describe('getCount', () => {
    it('should return the total count of documents', async () => {
      const mockSearchParam = { isActive: true };
      const expectedCount = 10;

      (userModel.find as jest.Mock).mockReturnValue({
        countDocuments: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(expectedCount),
      });

      const result = await usersService.getCount(mockSearchParam);
      expect(result).toEqual(expectedCount);
      expect(userModel.find).toHaveBeenCalledWith(mockSearchParam);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = 'randomId';
      const deletedUser = {
        _id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      (userModel.findOneAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(deletedUser),
      });

      const result = await usersService.deleteUser(userId);
      expect(result).toEqual(deletedUser);
      expect(userModel.findOneAndDelete).toHaveBeenCalledWith({ _id: userId });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 'randomId';
      const updatedUser: User = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
      };
      const existingUser = {
        _id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      const updatedUserResult = { ...existingUser, ...updatedUser };

      (userModel.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUserResult),
      });

      const result = await usersService.updateUser(userId, updatedUser);
      expect(result).toEqual(updatedUserResult);
      expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: userId },
        updatedUser,
        { new: true },
      );
    });
  });

  // Add tests for other methods in a similar manner.
});
