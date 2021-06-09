import { forwardRef, Module } from '@nestjs/common';
import { CompanyService } from '@src/company/company.service';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { VoucherModule } from '@src/voucher/voucher.module';
import { VoucherResolver } from '@src/voucher/voucher.resolver';
import { VoucherService } from '@src/voucher/voucher.service';
import { PartnerResolver } from './partner.resolver';
import { PartnerService } from './partner.service';

@Module({
  providers: [
    PartnerResolver,
    PartnerService,
    VoucherResolver,
    VoucherService,
    OrderResolver,
    OrderService,
    EmployeeService,
    CompanyService,
  ],
  imports: [forwardRef(() => VoucherModule)],
})
export class PartnerModule {}
