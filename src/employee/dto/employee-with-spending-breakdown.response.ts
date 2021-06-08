import { Field, ObjectType } from '@nestjs/graphql';
import { Employee } from '../employee.model';
import { SpendingBreakdownResponse } from './spending-breakdown.response';

@ObjectType()
export class EmployeeWithSpendingBreakdownResponse extends Employee {
  @Field(() => SpendingBreakdownResponse)
  spendingBreakdown!: SpendingBreakdownResponse;
}
