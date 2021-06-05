import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@src/common/models/base.model';

@ObjectType()
export class OrderRaw extends BaseModel {
  @Field()
  date!: Date;

  @Field()
  employeeId!: number;

  @Field()
  voucherId!: number;
}
