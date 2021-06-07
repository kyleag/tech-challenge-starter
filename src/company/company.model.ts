import { Field, ObjectType } from '@nestjs/graphql';
import { Employee } from '@src/employee/employee.model';
import { CompanyRaw } from './dto/company.raw';

@ObjectType()
export class Company extends CompanyRaw {
  @Field(() => [Employee])
  employees?: Employee[];
}
