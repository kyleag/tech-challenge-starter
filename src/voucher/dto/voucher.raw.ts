import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@src/common/models/base.model';

// This represents a raw voucher data and how it was defined from the file source.
// In this case, it has a `partnerId`, which holds to which `Partner` a voucher is related to
@ObjectType()
export class VoucherRaw extends BaseModel {
  @Field()
  amount!: number;

  @Field()
  partnerId!: number;
}
