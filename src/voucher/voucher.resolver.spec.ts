import vouchers from '@data/vouchers';
import { Test, TestingModule } from '@nestjs/testing';
import { PartnerService } from '@src/partner/partner.service';
import { Voucher } from './voucher.model';
import { VoucherResolver } from './voucher.resolver';
import { VoucherService } from './voucher.service';

describe(VoucherResolver.name, () => {
  let voucherResolver: VoucherResolver;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [VoucherResolver, VoucherService, PartnerService],
    }).compile();

    voucherResolver = moduleRef.get<VoucherResolver>(VoucherResolver);
  });

  describe('get all vouchers', () => {
    let results: Voucher[];
    it('should return all vouchers', () => {
      results = voucherResolver.vouchers();
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
  });
});
