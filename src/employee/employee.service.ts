import employees from '@data/employees';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { OrderRaw } from '@src/order/dto/order.raw';
import { OrderService } from '@src/order/order.service';
import { EmployeeRaw } from './dto/employee.raw';

@Injectable()
export class EmployeeService extends FileSourceDatabaseService<EmployeeRaw> {
  constructor(private readonly orderService: OrderService) {
    super(employees);
  }
  orders(id: number): OrderRaw[] {
    return this.orderService.getAll({
      employeeId: id,
    });
  }
}
