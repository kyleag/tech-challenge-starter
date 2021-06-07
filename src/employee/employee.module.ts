import { Module } from '@nestjs/common';
import { CompanyService } from '@src/company/company.service';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { PartnerResolver } from '@src/partner/partner.resolver';
import { PartnerService } from '@src/partner/partner.service';
import { VoucherResolver } from '@src/voucher/voucher.resolver';
import { VoucherService } from '@src/voucher/voucher.service';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';

@Module({
  providers: [
    EmployeeResolver,
    EmployeeService,
    CompanyService,
    OrderResolver,
    OrderService,
    VoucherService,
    VoucherResolver,
    PartnerService,
    PartnerResolver,
  ],
})
export class EmployeeModule {}
