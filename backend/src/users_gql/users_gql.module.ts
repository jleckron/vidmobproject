import { Module } from '@nestjs/common';
import { UsersGQLController } from './users_gql.controller';
import { UsersGQLService } from './users_gql.service';

@Module({
  controllers: [UsersGQLController],
  providers: [UsersGQLService],
})
export class UsersGQLModule {}
