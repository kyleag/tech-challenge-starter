import partners from '@data/partners';
import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '@src/company/company.service';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { VoucherModule } from '@src/voucher/voucher.module';
import { VoucherResolver } from '@src/voucher/voucher.resolver';
import { VoucherService } from '@src/voucher/voucher.service';
import { Partner } from './partner.model';
import { PartnerResolver } from './partner.resolver';
import { PartnerService } from './partner.service';

describe(PartnerResolver.name, () => {
  let partnerResolver: PartnerResolver;
  let voucherResolver: VoucherResolver;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerResolver,
        PartnerService,
        VoucherResolver,
        VoucherService,
        OrderResolver,
        OrderService,
        EmployeeService,
        CompanyService,
      ],
      imports: [forwardRef(() => VoucherModule)],
    }).compile();

    partnerResolver = moduleRef.get<PartnerResolver>(PartnerResolver);
    voucherResolver = moduleRef.get<VoucherResolver>(VoucherResolver);
  });

  describe('get all partners', () => {
    let results: Partner[] = [];
    it('should return all partners', async () => {
      results = await partnerResolver.partners();
      expect(results.length).toStrictEqual(partners.length);
      results.forEach((result, index) => {
        expect(result.id).toStrictEqual(partners[index].id);
      });
    });

    it('should calculate the total revenue for every partner', () => {
      results.forEach(async (partner) => {
        // retrieve related vouchers
        const vouchers = await voucherResolver.vouchers({
          partnerId: partner.id,
        });
        const calculatedRevenue = vouchers.reduce((total, voucher) => {
          total += voucher.revenue;
          return total;
        }, 0);
        expect(partner.revenue).toStrictEqual(calculatedRevenue);
      });
    });
  });
});
