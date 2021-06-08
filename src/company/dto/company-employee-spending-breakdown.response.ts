import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { EmployeeWithSpendingBreakdownResponse } from '@src/employee/dto/employee-with-spending-breakdown.response';
import { Company } from '../company.model';

@ObjectType()
export class CompanyEmployeeSpendingBreakdown extends OmitType(Company, [
  'employees',
] as const) {
  @Field(() => [EmployeeWithSpendingBreakdownResponse])
  employees!: EmployeeWithSpendingBreakdownResponse[];
}
