import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@src/common/models/base.model';

// This represents a raw employee data and how it was defined from the file source.
// In this case, it has a `companyId`, which holds to which `Company` an employee is related to
@ObjectType()
export class EmployeeRaw extends BaseModel {
  @Field()
  name!: string;

  @Field()
  budget!: number;

  @Field()
  companyId!: number;
}
