import { Module } from '@nestjs/common';
import { PartnerService } from '@src/partner/partner.service';
import { VoucherResolver } from './voucher.resolver';
import { VoucherService } from './voucher.service';

@Module({
  providers: [VoucherResolver, VoucherService, PartnerService],
})
export class VoucherModule {}
