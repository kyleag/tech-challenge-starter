import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DateFilterInput {
  @Field(() => String)
  from!: string;

  @Field(() => String, { nullable: true })
  to?: string;
}
