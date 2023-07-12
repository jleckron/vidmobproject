import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGQL, UserGQLSchema } from './models/user_gql.model';
import { UsersGQLResolver } from './users_gql.resolver';
import { UsersGQLService } from './users_gql.service';

@Module({
  controllers: [],
  providers: [UsersGQLResolver, UsersGQLService],
  imports: [
    MongooseModule.forFeature([
      {
        name: UserGQL.name,
        schema: UserGQLSchema,
      },
    ]),
  ],
})
export class UsersGQLModule {}
