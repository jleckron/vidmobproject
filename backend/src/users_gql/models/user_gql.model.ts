import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserGQL {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;
}
