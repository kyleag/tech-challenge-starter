import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CompanySingleEmployeesBudgetFilterArgs {
  @Field(() => Number)
  id!: number;

  @Field(() => Number, { defaultValue: 0 })
  budget!: number;

  @Field(() => Number, { nullable: true })
  month?: number;

  @Field(() => Number, { nullable: true })
  year?: number;
}
