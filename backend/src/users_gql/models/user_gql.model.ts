import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';

export type UserGQLDocument = UserGQL & Document;

@ObjectType()
@Schema({ timestamps: true, collection: 'users' })
export class UserGQL {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field({ description: 'User First Name' })
  firstName: string;

  @Prop()
  @Field({ description: 'User Last Name' })
  lastName: string;

  @Prop({ unique: true })
  @Field({ description: 'User Email' })
  email: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const UserGQLSchema = SchemaFactory.createForClass(UserGQL);
