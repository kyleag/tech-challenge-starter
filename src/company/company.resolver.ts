import { Query, Resolver } from '@nestjs/graphql';
import { EmployeeResolver } from '@src/employee/employee.resolver';
import { Company } from './company.model';
import { CompanyService } from './company.service';

@Resolver('Company')
export class CompanyResolver {
  constructor(
    private readonly companyService: CompanyService,
    private readonly employeeResolver: EmployeeResolver,
  ) {}

  @Query(() => [Company])
  companies(): Company[] {
    return this.companyService.getAll().map((company) => {
      return {
        ...company,
        employees: this.employeeResolver.employees({
          companyId: company.id,
        }),
      };
    });
  }
}
