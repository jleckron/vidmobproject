import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersGQLModule } from './users_gql/users_gql.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [UsersModule, CommonModule, UsersGQLModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
