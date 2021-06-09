import { forwardRef, Module } from '@nestjs/common';
import { CompanyModule } from '@src/company/company.module';
import { CompanyService } from '@src/company/company.service';
import { EmployeeModule } from '@src/employee/employee.module';
import { EmployeeService } from '@src/employee/employee.service';
import { VoucherModule } from '@src/voucher/voucher.module';
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
  ],
  imports: [
    forwardRef(() => EmployeeModule),
    forwardRef(() => VoucherModule),
    forwardRef(() => CompanyModule),
  ],
})
export class OrderModule {}
