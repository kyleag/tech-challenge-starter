import { Field, ObjectType } from '@nestjs/graphql';
import { Voucher } from '@src/voucher/voucher.model';
import { PartnerRaw } from './dto/partner.raw';

@ObjectType()
export class Partner extends PartnerRaw {
  @Field(() => [Voucher])
  vouchers!: Voucher[];

  @Field(() => Number)
  revenue!: number;
}
