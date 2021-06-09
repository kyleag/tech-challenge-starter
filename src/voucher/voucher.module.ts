import { Module } from '@nestjs/common';
import { CompanyService } from '@src/company/company.service';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { PartnerResolver } from '@src/partner/partner.resolver';
import { PartnerService } from '@src/partner/partner.service';
import { VoucherResolver } from './voucher.resolver';
import { VoucherService } from './voucher.service';

@Module({
  providers: [
    VoucherResolver,
    VoucherService,
    PartnerService,
    PartnerResolver,
    OrderService,
    OrderResolver,
    EmployeeService,
    CompanyService,
  ],
})
export class VoucherModule {}
