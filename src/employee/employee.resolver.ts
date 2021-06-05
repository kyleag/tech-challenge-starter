import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Company } from '@src/company/company.model';
import { CompanyService } from '@src/company/company.service';
import { EmployeeRaw } from './dto/employee.raw';
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
    return this.employeeService.getAll();
  }

  @ResolveField('company')
  company(@Parent() employee: EmployeeRaw): Company {
    const { companyId } = employee;
    return this.companyService.getById(companyId);
  }
}
