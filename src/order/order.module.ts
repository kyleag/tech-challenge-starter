import { Module } from '@nestjs/common';
import { EmployeeService } from '@src/employee/employee.service';
import { VoucherService } from '@src/voucher/voucher.service';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  providers: [OrderResolver, OrderService, EmployeeService, VoucherService],
})
export class OrderModule {}
