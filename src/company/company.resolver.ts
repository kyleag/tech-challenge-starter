import { Args, Query, Resolver } from '@nestjs/graphql';
import { EMPLOYEE_MAXIMUM_NONTAXABLE_BUDGET } from '@src/common/constants/budget';
import { getLastDayOfMonth } from '@src/common/helpers/date-helper';
import { EmployeeResolver } from '@src/employee/employee.resolver';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { CompanyEmployeesBudgetFilterArgs } from './dto/company-employees-budget-filter.args';
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

  @Query(() => [Company])
  async companiesEmployeesOfRemaingBudget(
    @Args()
    {
      budget = 0,
      month = new Date().getMonth() + 1, // since january starts at 0
      year = new Date().getFullYear(),
    }: CompanyEmployeesBudgetFilterArgs,
  ): Promise<Company[]> {
    // get the start, end date for the specified month of the current year
    const dateFrom = new Date(`${year}-${month}-01`);
    const dateTo = getLastDayOfMonth(dateFrom).toString();

    // @TODO - move business logic to `service` level?
    // then filter the companies' employees to only include orders for the month specified
    const companies = await this.companies({
      employees: {
        orders: {
          date: {
            from: dateFrom.toString(),
            to: dateTo.toString(),
          },
        },
      },
    });

    // only include companies' employees with more than the specified budget remaining
    return companies.map((company) => {
      return {
        ...company,
        employees: company.employees?.filter((employee) => {
          const orders = employee?.orders ?? [];
          const total = orders.reduce((acc, curr) => {
            acc += curr.voucher.amount;
            return acc;
          }, 0);
          const remaining = employee.budget - total;
          return remaining > budget;
        }),
      };
    });
  }
}
