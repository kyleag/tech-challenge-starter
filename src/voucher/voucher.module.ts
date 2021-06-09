import { forwardRef, Module } from '@nestjs/common';
import { CompanyService } from '@src/company/company.service';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderModule } from '@src/order/order.module';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { VoucherResolver } from './voucher.resolver';
import { VoucherService } from './voucher.service';

@Module({
  providers: [
    VoucherResolver,
    VoucherService,
    OrderResolver,
    OrderService,
    EmployeeService,
    CompanyService,
  ],
  imports: [forwardRef(() => OrderModule)],
})
export class VoucherModule {}
