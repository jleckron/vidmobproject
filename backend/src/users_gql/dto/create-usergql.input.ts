import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserGQLInput {
  @Field(() => String)
  firstName: string;
  @Field(() => String)
  lastName: string;
  @Field(() => String)
  email: string;
}
