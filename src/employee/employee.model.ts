import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { Order } from '@src/order/order.model';
import { Company } from '../company/company.model';
import { EmployeeRaw } from './dto/employee.raw';

@ObjectType('Employee')
export class Employee extends OmitType(EmployeeRaw, ['companyId'] as const) {
  @Field(() => Company)
  company!: Company;

  @Field(() => [Order])
  orders?: Order[];
}
