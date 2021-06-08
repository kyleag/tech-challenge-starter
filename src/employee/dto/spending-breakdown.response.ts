import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SpendingBreakdownResponse {
  @Field(() => Number)
  total!: number;

  @Field(() => Number)
  taxFree!: number;

  @Field(() => Number)
  taxable!: number;

  @Field(() => Number)
  netSalary!: number;
}
