import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateUserGQLInput } from './create-usergql.input';

@InputType()
export class UpdateUserGQLInput extends PartialType(CreateUserGQLInput) {
  @Field(() => String)
  _id: string;
}
