import { forwardRef, Module } from '@nestjs/common';
import { EmployeeModule } from '@src/employee/employee.module';
import { EmployeeResolver } from '@src/employee/employee.resolver';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderModule } from '@src/order/order.module';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { VoucherService } from '@src/voucher/voucher.service';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';

@Module({
  providers: [
    CompanyService,
    CompanyResolver,
    OrderService,
    EmployeeService,
    VoucherService,
    EmployeeResolver,
    OrderResolver,
  ],
  imports: [forwardRef(() => EmployeeModule), forwardRef(() => OrderModule)],
})
export class CompanyModule {}
