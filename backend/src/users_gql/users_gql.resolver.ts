/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Resolver } from '@nestjs/graphql';
import { UsersGQLService } from './users_gql.service';
import { UserGQL } from './models/user_gql.model';

@Resolver((of) => UserGQL)
export class UsersGQLResolver {
  constructor(private usersGQLService: UsersGQLService) {}

  @Query((returns) => [UserGQL])
  users(): Promise<UserGQL[]> {
    return this.usersGQLService.getAll();
  }
}
