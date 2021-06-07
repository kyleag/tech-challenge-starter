import { Module } from '@nestjs/common';
import { EmployeeResolver } from '@src/employee/employee.resolver';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { PartnerResolver } from '@src/partner/partner.resolver';
import { PartnerService } from '@src/partner/partner.service';
import { VoucherResolver } from '@src/voucher/voucher.resolver';
import { VoucherService } from '@src/voucher/voucher.service';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';

@Module({
  providers: [
    // @TODO - import `EmployeeModule` instead?
    // can't seem to make it work, though
    // sticking with this approach for now
    CompanyService,
    CompanyResolver,
    EmployeeResolver,
    EmployeeService,
    OrderResolver,
    OrderService,
    VoucherService,
    VoucherResolver,
    PartnerService,
    PartnerResolver,
  ],
})
export class CompanyModule {}
