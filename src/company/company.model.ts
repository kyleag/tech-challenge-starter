import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()

// using assertions (!) on fields to ignore issues with having no constructor
// see https://github.com/nestjs/nest/issues/4178#issuecomment-613197634
export class Company {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;
}
