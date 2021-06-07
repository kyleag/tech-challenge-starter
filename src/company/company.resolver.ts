import { Args, Query, Resolver } from '@nestjs/graphql';
import { EmployeeResolver } from '@src/employee/employee.resolver';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { CompanyFilterArgs } from './dto/company-filter.args';

@Resolver('Company')
export class CompanyResolver {
  constructor(
    private readonly companyService: CompanyService,
    private readonly employeeResolver: EmployeeResolver,
  ) {}

  @Query(() => [Company])
  async companies(
    @Args() { employees: employeesFilter, ...filters }: CompanyFilterArgs = {},
  ): Promise<Company[]> {
    const rawCompanies = this.companyService.getAll(filters);
    const companies: Company[] = [];
    for (const rawCompany of rawCompanies) {
      companies.push({
        ...rawCompany,
        employees: await this.employeeResolver.employees({
          ...employeesFilter,
          companyId: rawCompany.id,
        }),
      });
    }
    return companies;
  }
}
