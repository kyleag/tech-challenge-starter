import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@src/common/models/base.model';

@ObjectType()
export class PartnerRaw extends BaseModel {
  @Field()
  name!: string;
}
