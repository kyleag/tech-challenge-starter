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
    return this.voucherService.getAll().map(({ partnerId, ...voucher }) => {
      return {
        ...voucher,
        // @TODO - use `ResolveField`?
        // doing this since testing this method *DOES NOT* automatically resolve the fields that need to be resolved
        // and it seems like the `ResolveField` only works when doing an actual graphql query
        partner: this.partnerService.getById(partnerId),
      };
    });
  }
}
