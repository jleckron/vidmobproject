import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { GraphqlModule } from 'src/graphql/graphql.module';
import { MongoModule } from './mongo.module';

@Module({
  imports: [ConfigModule, GraphqlModule, MongoModule],
  exports: [ConfigModule, GraphqlModule, MongoModule],
})
export class CommonModule {}
