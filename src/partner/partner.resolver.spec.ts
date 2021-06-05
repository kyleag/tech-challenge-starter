import partners from '@data/partners';
import { Test, TestingModule } from '@nestjs/testing';
import { PartnerResolver } from './partner.resolver';
import { PartnerService } from './partner.service';

describe(PartnerResolver.name, () => {
  let partnerResolver: PartnerResolver;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [PartnerResolver, PartnerService],
    }).compile();

    partnerResolver = moduleRef.get<PartnerResolver>(PartnerResolver);
  });

  describe('get all partners', () => {
    it('should return all partners', () => {
      const results = partnerResolver.partners();
      expect(results.length).toStrictEqual(partners.length);
      results.forEach((result, index) => {
        expect(result.id).toStrictEqual(partners[index].id);
      });
    });
  });
});
