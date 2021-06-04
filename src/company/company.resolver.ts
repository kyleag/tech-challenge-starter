import { Query, Resolver } from '@nestjs/graphql';
import { Company } from './company.model';
import { CompanyService } from './company.service';

@Resolver('Company')
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Query(() => [Company])
  companies(): Company[] {
    return this.companyService.getAll();
  }
}
