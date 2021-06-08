import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CompanyEmployeesBudgetFilterArgs {
  @Field(() => Number, { defaultValue: 0 })
  budget!: number;

  @Field(() => Number, { nullable: true })
  month?: number;

  @Field(() => Number, { nullable: true })
  year?: number;
}
