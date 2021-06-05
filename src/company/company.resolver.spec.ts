import companies from '@data/companies';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';

describe(CompanyResolver.name, () => {
  let companyResolver: CompanyResolver;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [CompanyResolver, CompanyService],
    }).compile();

    companyResolver = moduleRef.get<CompanyResolver>(CompanyResolver);
  });

  describe('get all companies', () => {
    it('should return all companies', () => {
      const results = companyResolver.companies();
      expect(results.length).toStrictEqual(companies.length);
      results.forEach((result, index) => {
        expect(result.id).toStrictEqual(companies[index].id);
      });
    });
  });
});
