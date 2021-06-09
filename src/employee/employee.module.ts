import { forwardRef, Module } from '@nestjs/common';
import { CompanyModule } from '@src/company/company.module';
import { CompanyService } from '@src/company/company.service';
import { OrderModule } from '@src/order/order.module';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
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
  ],
  imports: [forwardRef(() => CompanyModule), forwardRef(() => OrderModule)],
})
export class EmployeeModule {}
