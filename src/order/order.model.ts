import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { Employee } from '@src/employee/employee.model';
import { Voucher } from '@src/voucher/voucher.model';
import { OrderRaw } from './dto/order.raw';

@ObjectType('Order')
export class Order extends OmitType(OrderRaw, [
  'employeeId',
  'voucherId',
] as const) {
  @Field(() => Employee)
  employee!: Employee;

  @Field(() => Voucher)
  voucher!: Voucher;
}
