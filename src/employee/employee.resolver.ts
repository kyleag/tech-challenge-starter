import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Company } from '@src/company/company.model';
import { CompanyService } from '@src/company/company.service';
import { Employee } from './employee.model';
import { EmployeeService } from './employee.service';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,
  ) {}

  @Query(() => [Employee])
  employees(): Employee[] {
    return this.employeeService.getAll().map(({ companyId, ...employee }) => {
      return {
        ...employee,
        // @TODO - use `ResolveField`?
        // doing this since testing this method *DOES NOT* automatically resolve the fields that need to be resolved
        // and it seems like the `ResolveField` only works when doing an actual graphql query
        company: this.companyService.getById(companyId),
      } as Employee;
    });
  }
}
