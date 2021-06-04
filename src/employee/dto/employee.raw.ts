import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@src/common/models/base.model';

@ObjectType()
export class EmployeeRaw extends BaseModel {
  @Field()
  name!: string;

  @Field()
  budget!: number;

  @Field()
  companyId!: number;
}
