import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersGQLModule } from './users_gql/users_gql.module';
import { UsersGQLController } from './users_gql/users_gql.controller';
import { join } from 'path';
import { UsersGQLResolver } from './users_gql/users_gql.resolver';
import { UsersGQLService } from './users_gql/users_gql.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersGQLModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController, UsersGQLController],
  providers: [AppService, UsersGQLService, UsersGQLResolver],
})
export class AppModule {}
