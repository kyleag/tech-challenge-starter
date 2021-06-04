import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@src/common/models/base.model';
import { Company } from '../company/company.model';

@ObjectType('Employee')
export class Employee extends BaseModel {
  @Field()
  name!: string;

  @Field()
  budget!: number;

  @Field(() => Company)
  company!: Company;
}
