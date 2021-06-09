import vouchers from '@data/vouchers';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '@src/company/company.service';
import { EmployeeService } from '@src/employee/employee.service';
import { Order } from '@src/order/order.model';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { PartnerResolver } from '@src/partner/partner.resolver';
import { PartnerService } from '@src/partner/partner.service';
import { Voucher } from './voucher.model';
import { VoucherResolver } from './voucher.resolver';
import { VoucherService } from './voucher.service';

describe(VoucherResolver.name, () => {
  let voucherResolver: VoucherResolver;
  let orderService: OrderService;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherResolver,
        VoucherService,
        PartnerService,
        PartnerResolver,
        OrderService,
        OrderResolver,
        EmployeeService,
        CompanyService,
      ],
    }).compile();

    voucherResolver = moduleRef.get<VoucherResolver>(VoucherResolver);
    orderService = moduleRef.get<OrderService>(OrderService);
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

    it('should correctly retrieve the related partner', () => {
      // check the last item of both the voucher data and the result
      const voucherToCheck = [...vouchers].slice(-1).pop();
      const resultToCheck = [...results].slice(-1).pop();
      expect(resultToCheck?.partner.id).toStrictEqual(
        voucherToCheck?.partnerId,
      );
    });

    it('should correctly retrieve the related orders', () => {
      results.forEach((voucher) => {
        // retrieve related orders for the current voucher
        const orders = orderService.getAll({
          voucherId: voucher.id,
        });
        const resultingOrderIds = voucher.orders.map((order) => order.id);
        const retrievedOrderIds = orders.map((order) => order.id);
        expect(resultingOrderIds.sort()).toEqual(retrievedOrderIds.sort());
      });
    });
  });
});
