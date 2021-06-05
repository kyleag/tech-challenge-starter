import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Partner } from '@src/partner/partner.model';
import { PartnerService } from '@src/partner/partner.service';
import { VoucherRaw } from './dto/voucher.raw';
import { Voucher } from './voucher.model';
import { VoucherService } from './voucher.service';

@Resolver(() => Voucher)
export class VoucherResolver {
  constructor(
    private readonly voucherService: VoucherService,
    private readonly partnerService: PartnerService,
  ) {}

  @Query(() => [Voucher])
  vouchers(): Voucher[] {
    return this.voucherService.getAll();
  }

  @ResolveField('partner')
  partner(@Parent() voucher: VoucherRaw): Partner {
    const { partnerId } = voucher;
    return this.partnerService.getById(partnerId);
  }
}
