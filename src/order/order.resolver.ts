import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Employee } from '@src/employee/employee.model';
import { EmployeeService } from '@src/employee/employee.service';
import { Voucher } from '@src/voucher/voucher.model';
import { VoucherService } from '@src/voucher/voucher.service';
import { OrderRaw } from './dto/order.raw';
import { Order } from './order.model';
import { OrderService } from './order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly employeeService: EmployeeService,
    private readonly voucherService: VoucherService,
  ) {}

  @Query(() => [Order])
  orders(): Order[] {
    return this.orderService.getAll();
  }

  @ResolveField('employee')
  employee(@Parent() order: OrderRaw): Employee {
    const { employeeId } = order;
    return this.employeeService.getById(employeeId);
  }

  @ResolveField('voucher')
  voucher(@Parent() order: OrderRaw): Voucher {
    const { voucherId } = order;
    return this.voucherService.getById(voucherId);
  }
}
