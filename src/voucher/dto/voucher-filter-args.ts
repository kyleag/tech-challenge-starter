import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class VoucherFilterArgs {
  @Field(() => Number, { nullable: true })
  id?: number;

  @Field(() => Number, { nullable: true })
  amount?: number;

  @Field(() => Number, { nullable: true })
  partnerId?: number;

  @Field(() => String, { nullable: true })
  taxType?: string;

  // @TODO - include filtering of orders of a certain voucher
}
