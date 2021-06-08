import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class EmployeeSpendingBreakdownFilterArgs {
  @Field(() => Number)
  id!: number;

  @Field(() => Number)
  month!: number;

  @Field(() => Number, { nullable: true })
  year?: number;
}
