import {
  Body,
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
    return await this.usersService.addUser(user);
  }

  @Get()
  async getAllUsers(
    @Query() query: ExpressQuery,
  ): Promise<{ users: User[]; count: number }> {
    return await this.usersService.getUsers(query);
  }

  @Put(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(userId, body);
  }

  @Delete(':id')
  async removeUser(@Param('id') userId: string): Promise<User> {
    return await this.usersService.deleteUser(userId);
  }
}
