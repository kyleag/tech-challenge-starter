import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseModel {
  @Field(() => ID)
  id!: number;
}
