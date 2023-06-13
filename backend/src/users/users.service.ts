import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';

import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addUser(user: User): Promise<User> {
    return await this.userModel.create(user);
  }

  async getCount(searchParam): Promise<number> {
    return await this.userModel.find({ ...searchParam }).count();
  }

  async getUsers(query: Query): Promise<{ users: User[]; count: number }> {
    const searchParam = query.search
      ? {
          $or: [
            { firstName: { $regex: query.search, $options: 'i' } },
            { lastName: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
          ],
        }
      : {};

    const resultsPerPage = Number(query.size);
    const currentPage = Number(query.page);
    const skip = resultsPerPage * currentPage;

    const users = await this.userModel
      .find({ ...searchParam })
      .limit(resultsPerPage)
      .skip(skip);
    const count = await this.getCount(searchParam);
    return { users, count };
  }

  async deleteUser(userId: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(userId);
  }

  async updateUser(userId: string, user: User): Promise<User> {
    return await this.userModel.findByIdAndUpdate(userId, user, {
      new: true,
      runValidators: true,
    });
  }
}
