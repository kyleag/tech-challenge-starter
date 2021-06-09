import orders from '@data/orders';
import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyModule } from '@src/company/company.module';
import { CompanyService } from '@src/company/company.service';
import { EmployeeModule } from '@src/employee/employee.module';
import { EmployeeService } from '@src/employee/employee.service';
import { VoucherModule } from '@src/voucher/voucher.module';
import { VoucherService } from '@src/voucher/voucher.service';
import { Order } from './order.model';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

describe(OrderResolver.name, () => {
  let orderResolver: OrderResolver;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
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
    }).compile();

    orderResolver = moduleRef.get<OrderResolver>(OrderResolver);
  });

  describe('get all orders', () => {
    let results: Order[];
    it('should return all employees', async () => {
      results = await orderResolver.orders();
      expect(results.length).toStrictEqual(orders.length);
      results.forEach((result, index) => {
        expect(result.id).toStrictEqual(orders[index].id);
      });
    });

    it('should correctly retrieve the related employee, voucher', () => {
      // check the last item of both the orcer data and the result
      const orderToCheck = [...orders].slice(-1).pop();
      const resultToCheck = [...results].slice(-1).pop();
      expect(resultToCheck?.employee.id).toStrictEqual(
        orderToCheck?.employeeId,
      );
      expect(resultToCheck?.voucher.id).toStrictEqual(orderToCheck?.voucherId);
    });
  });
});
