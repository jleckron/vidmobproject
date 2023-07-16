import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class FetchUsersArgs {
  @Field(() => Int)
  @Min(0)
  page = 0;

  @Field(() => Int)
  @Min(5)
  @Max(50)
  size = 5;

  @Field()
  sortBy: 'createdAt';

  @Field()
  order: 'asc' | 'desc';

  @Field()
  search: '';
}
