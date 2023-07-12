import { Test, TestingModule } from '@nestjs/testing';
import { UsersGQLController } from './users_gql.controller';

describe('UsersGraphqlController', () => {
  let controller: UsersGQLController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersGQLController],
    }).compile();

    controller = module.get<UsersGQLController>(UsersGQLController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
