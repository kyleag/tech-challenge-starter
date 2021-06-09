import partners from '@data/partners';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { VoucherService } from '@src/voucher/voucher.service';
import { PartnerRawResponse } from './dto/partner-raw.response';
import { PartnerRaw } from './dto/partner.raw';

@Injectable()
export class PartnerService extends FileSourceDatabaseService<PartnerRaw> {
  constructor(private readonly voucherService: VoucherService) {
    super(partners);
  }

  getAll(filters: Partial<PartnerRaw>): PartnerRawResponse[] {
    const partnersRaw = super.getAll(filters);
    return partnersRaw.map((partnerRaw) => {
      // retrieve related vouchers
      const vouchersRaw = this.voucherService.getAll({
        partnerId: partnerRaw.id,
      });
      return {
        ...partnerRaw,
        revenue: vouchersRaw.reduce((total, voucher) => {
          total += voucher.revenue;
          return total;
        }, 0),
        voucherIds: vouchersRaw.map((voucher) => voucher.id),
      };
    });
  }
}
