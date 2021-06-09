import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { Order } from '@src/order/order.model';
import { Partner } from '@src/partner/partner.model';
import { VoucherRaw } from './dto/voucher.raw';

@ObjectType('Voucher')
export class Voucher extends OmitType(VoucherRaw, ['partnerId'] as const) {
  @Field(() => Partner)
  partner!: Partner;

  @Field(() => Order)
  orders!: Order[];
}
