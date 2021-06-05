import { Module } from '@nestjs/common';
import { CompanyService } from '@src/company/company.service';
import { EmployeeService } from '@src/employee/employee.service';
import { PartnerService } from '@src/partner/partner.service';
import { VoucherService } from '@src/voucher/voucher.service';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  providers: [
    OrderResolver,
    OrderService,
    EmployeeService,
    VoucherService,
    CompanyService,
    PartnerService,
  ],
})
export class OrderModule {}
