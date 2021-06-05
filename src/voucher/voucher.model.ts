import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { Partner } from '@src/partner/partner.model';
import { VoucherRaw } from './dto/voucher.raw';

@ObjectType('Voucher')
export class Voucher extends OmitType(VoucherRaw, ['partnerId'] as const) {
  @Field(() => Partner)
  partner!: Partner;
}
