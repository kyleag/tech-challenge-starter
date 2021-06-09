import { Args, Query, Resolver } from '@nestjs/graphql';
import { Voucher } from '@src/voucher/voucher.model';
import { VoucherResolver } from '@src/voucher/voucher.resolver';
import { PartnerFilter } from './dto/partner-filter.args';
import { Partner } from './partner.model';
import { PartnerService } from './partner.service';

@Resolver()
export class PartnerResolver {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly voucherResolver: VoucherResolver,
  ) {}

  @Query(() => [Partner])
  async partners(@Args() filters: PartnerFilter = {}): Promise<Partner[]> {
    const partnersRaw = this.partnerService.getAll(filters);
    const partners: Partner[] = [];
    for (const { voucherIds, ...partnerRaw } of partnersRaw) {
      const vouchers: Voucher[] = [];
      for (const voucherId of voucherIds) {
        const voucher = await this.voucherResolver.voucher({
          id: voucherId,
        });
        vouchers.push(voucher);
      }
      partners.push({
        ...partnerRaw,
        vouchers,
      });
    }
    return partners;
  }

  @Query(() => Partner)
  async partner(@Args() filters: PartnerFilter): Promise<Partner> {
    return (await this.partners(filters)).shift() as Partner;
  }
}
