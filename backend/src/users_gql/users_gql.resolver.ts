import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersGQLService } from './users_gql.service';
import { UserGQL } from './models/user_gql.model';
import { CreateUserGQLInput } from './dto/create-usergql.input';
import { UpdateUserGQLInput } from './dto/update-usergql.input';
import { FetchUsersArgs } from './dto/fetch-users.input';

@Resolver(() => UserGQL)
export class UsersGQLResolver {
  constructor(private readonly usersGQLService: UsersGQLService) {}

  @Query(() => Number, { name: 'count' })
  async getCount(@Args('search') search: string): Promise<number> {
    return await this.usersGQLService.getCount(search);
  }

  @Query(() => [UserGQL], { name: 'users' })
  async getUsers(@Args() args: FetchUsersArgs): Promise<UserGQL[]> {
    return await this.usersGQLService.findAll(args);
  }

  @Mutation(() => UserGQL)
  createUser(
    @Args('createUserGQLInput') createUserGQLInput: CreateUserGQLInput,
  ): Promise<UserGQL> {
    return this.usersGQLService.create(createUserGQLInput);
  }

  @Mutation(() => UserGQL)
  updateUser(
    @Args('updateUserGQLInput') updateUserGQLInput: UpdateUserGQLInput,
  ): Promise<UserGQL> {
    return this.usersGQLService.update(
      updateUserGQLInput._id,
      updateUserGQLInput,
    );
  }

  @Mutation(() => UserGQL)
  deleteUser(
    @Args('_id', { type: () => String }) id: string,
  ): Promise<UserGQL> {
    return this.usersGQLService.remove(id);
  }
}
