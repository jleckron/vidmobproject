import { Test, TestingModule } from '@nestjs/testing';
import { UsersGQLResolver } from './users_gql.resolver';

describe('UsersGraphqlResolver', () => {
  let resolver: UsersGQLResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersGQLResolver],
    }).compile();

    resolver = module.get<UsersGQLResolver>(UsersGQLResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
