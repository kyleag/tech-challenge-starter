import vouchers from '@data/vouchers';
import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '@src/company/company.service';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderModule } from '@src/order/order.module';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { Voucher } from './voucher.model';
import { VoucherResolver } from './voucher.resolver';
import { VoucherService } from './voucher.service';

describe(VoucherResolver.name, () => {
  let voucherResolver: VoucherResolver;
  let orderResolver: OrderResolver;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherResolver,
        VoucherService,
        OrderResolver,
        OrderService,
        EmployeeService,
        CompanyService,
      ],
      imports: [forwardRef(() => OrderModule)],
    }).compile();

    voucherResolver = moduleRef.get<VoucherResolver>(VoucherResolver);
    orderResolver = moduleRef.get<OrderResolver>(OrderResolver);
  });

  describe('get all vouchers', () => {
    let results: Voucher[];
    it('should return all vouchers', async () => {
      results = await voucherResolver.vouchers();
      expect(results.length).toStrictEqual(vouchers.length);
      results.forEach((result, index) => {
        expect(result.id).toStrictEqual(vouchers[index].id);
      });
    });

    // @TODO - removed the autoresolution of `partner` since it is giving me dependency issues
    // might got fixed once the modules gets properly imported
    // guessing there is also a circular dependency that is happening
    // it('should correctly retrieve the related partner', () => {
    //   // check the last item of both the voucher data and the result
    //   const voucherToCheck = [...vouchers].slice(-1).pop();
    //   const resultToCheck = [...results].slice(-1).pop();
    //   expect(resultToCheck?.partner.id).toStrictEqual(
    //     voucherToCheck?.partnerId,
    //   );
    // });

    it('should correctly retrieve the related orders', () => {
      results.forEach(async (voucher) => {
        // retrieve related orders for the current voucher
        const orders = await orderResolver.orders({
          voucherId: voucher.id,
        });
        const resultingOrderIds = voucher.orders.map((order) => order.id);
        const retrievedOrderIds = orders.map((order) => order.id);
        expect(resultingOrderIds.sort()).toEqual(retrievedOrderIds.sort());
      });
    });

    it('should calculate the revenue per voucher', () => {
      results.forEach(async (voucher) => {
        // manually calculate the total revenue
        const orders = await orderResolver.orders({
          voucherId: voucher.id,
        });
        const calculatedRevenue = orders.reduce((total, order) => {
          total += order.voucher.amount;
          return total;
        }, 0);
        expect(voucher.revenue).toStrictEqual(calculatedRevenue);
      });
    });
  });
});
