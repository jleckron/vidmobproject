import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserGQLInput } from './dto/create-usergql.input';
import { FetchUsersArgs } from './dto/fetch-users.input';
import { UpdateUserGQLInput } from './dto/update-usergql.input';
import { UserGQL } from './models/user_gql.model';

@Injectable()
export class UsersGQLService {
  constructor(
    @InjectModel(UserGQL.name) private userGQLModel: Model<UserGQL>,
  ) {}

  formatSearchQuery = (search: string) => {
    return search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
  };

  async getCount(search: string): Promise<number> {
    const searchParam = this.formatSearchQuery(search);
    return await this.userGQLModel
      .find({ ...searchParam })
      .countDocuments()
      .exec();
  }

  async findAll(args: FetchUsersArgs): Promise<UserGQL[]> {
    const searchParam = this.formatSearchQuery(args.search);

    const skip = args.page * args.size;

    return await this.userGQLModel
      .find({ ...searchParam })
      .sort([[args.sortBy, args.order]])
      .limit(args.size)
      .skip(skip)
      .exec();
  }

  create(createUserGQLInput: CreateUserGQLInput): Promise<UserGQL> {
    const user = new this.userGQLModel(createUserGQLInput);
    return user.save();
  }

  async update(
    id: string,
    updateUserGQLInput: UpdateUserGQLInput,
  ): Promise<UserGQL> {
    const existingUser = await this.userGQLModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updateUserGQLInput },
        { new: true },
      )
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return existingUser;
  }

  async remove(id: string): Promise<UserGQL> {
    const user = await this.userGQLModel.findOneAndDelete({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`Couldnt delete the user id ${id}`);
    }
    return user;
  }
}
