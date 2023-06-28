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

  /**
   * Performs creating a new user
   * @param user
   * @returns Promise<User>
   */
  async addUser(user: User): Promise<User> {
    return await this.userModel.create(user);
  }

  /**
   * Gets total document count given a set of search paramters
   * @param searchParam
   * @returns Promise<User>
   */
  async getCount(searchParam): Promise<number> {
    return await this.userModel
      .find({ ...searchParam })
      .count()
      .exec();
  }

  /**
   * Performs returning a subset of users given a set of search parameters
   * @param query
   * @returns Promise<User>
   */
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
      .skip(skip)
      .exec();
    const count = await this.getCount(searchParam);
    return { users, count };
  }

  /**
   * Performs deletion of user with userId
   * @param userId
   * @returns Promise<User>
   */
  async deleteUser(userId: string): Promise<User> {
    return await this.userModel.findOneAndDelete({ _id: userId }).exec();
  }

  /**
   * Updates a user with userId with new user information body
   * @param userId
   * @param user
   * @returns Promise<User>
   */
  async updateUser(userId: string, user: User): Promise<User> {
    return await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { ...user },
        {
          new: true,
        },
      )
      .exec();
  }
}
