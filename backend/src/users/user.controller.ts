import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Query as ExpressQuery } from 'express-serve-static-core';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addNewUser(@Body() user: CreateUserDto): Promise<User> {
    let result;
    try {
      result = await this.usersService.addUser(user);
    } catch (error) {
      throw new ConflictException('Email Already In Use', {
        cause: error,
        description: 'Email Already In Use',
      });
    }
    return result;
  }

  @Get()
  async getAllUsers(
    @Query() query: ExpressQuery,
  ): Promise<{ users: User[]; count: number }> {
    return await this.usersService.getUsers(query);
  }

  @Put(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    let result;
    try {
      result = await this.usersService.updateUser(userId, body);
    } catch (error) {
      throw new ConflictException('Email Already In Use', {
        cause: error,
        description: 'Email Already In Use',
      });
    }
    return result;
  }

  @Delete(':id')
  async removeUser(@Param('id') userId: string): Promise<User> {
    return await this.usersService.deleteUser(userId);
  }
}
