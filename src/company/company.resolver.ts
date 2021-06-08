import { Args, Query, Resolver } from '@nestjs/graphql';
import { getLastDayOfMonth } from '@src/common/helpers/date-helper';
import { EmployeeSpendingBreakdownFilterArgs } from '@src/employee/dto/employee-spending-breakdown-filter.args';
import { EmployeeWithSpendingBreakdownResponse } from '@src/employee/dto/employee-with-spending-breakdown.response';
import { Employee } from '@src/employee/employee.model';
import { EmployeeResolver } from '@src/employee/employee.resolver';
import { Order } from '@src/order/order.model';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { CompanyEmployeeSpendingBreakdown } from './dto/company-employee-spending-breakdown.response';
import { CompanyEmployeesBudgetFilterArgs } from './dto/company-employees-budget-filter.args';
import { CompanyFilterArgs } from './dto/company-filter.args';
import { CompanySingleEmployeesBudgetFilterArgs } from './dto/company-single-employees-budget-filter.args';

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
      ...companyFilter
    }: CompanyEmployeesBudgetFilterArgs,
  ): Promise<Company[]> {
    // get the start, end date for the specified month of the current year
    const dateFrom = new Date(`${year}-${month}-01`);
    const dateTo = getLastDayOfMonth(dateFrom);
    const rawCompanies =
      this.companyService.getAllCompaniesEmployeesOfRemainingBudget({
        ...companyFilter,
        budget,
        dateFrom: dateFrom.toString(),
        dateTo: dateTo.toString(),
      });

    // now convert the resulting raw data to models (with their related submodels)
    const companies: Company[] = [];
    for (const rawCompany of rawCompanies) {
      const { employees: employeesList, ...company } = rawCompany;
      const employees: Employee[] = [];
      for (const employeeListData of employeesList) {
        // NOTE: the resulting employee model data includes the *unfiltered* orders
        // since we cannot filter orders by a callback function via `resolver`
        // since it is indented to be executed on a graphql request
        // and it *does not* accept callback functions as an argument
        const employee = await this.employeeResolver.employee({
          id: employeeListData.id,
        });
        const orders = employee.orders ?? [];
        employees.push({
          ...employee,
          // retrieve the correct filtered orders for the employee
          // since we cannot filter orders with a callback function via a resolver
          orders: orders.filter((order) => {
            return employeeListData.orderIds.includes(order.id);
          }) as Order[],
        } as Employee);
      }
      companies.push({
        ...company,
        employees,
      });
    }
    return companies;
  }

  @Query(() => Company)
  async companyEmployeesOfRemaingBudget(
    @Args()
    filter: CompanySingleEmployeesBudgetFilterArgs,
  ): Promise<Company> {
    return (
      await this.companiesEmployeesOfRemaingBudget(filter)
    ).shift() as Company;
  }

  @Query(() => CompanyEmployeeSpendingBreakdown)
  async companyEmployeesSpendingBreakdown(
    @Args()
    {
      month,
      year = new Date().getFullYear(),
      ...filters
    }: EmployeeSpendingBreakdownFilterArgs,
  ): Promise<CompanyEmployeeSpendingBreakdown> {
    const dateFrom = new Date(`${year}-${month}-01`);
    const { employees: employeesList, ...company } =
      this.companyService.getCompanyEmployeesSpendingBreakdown({
        ...filters,
        dateFrom: dateFrom.toString(),
      });
    const employees: EmployeeWithSpendingBreakdownResponse[] = [];
    for (const employeeListData of employeesList) {
      // NOTE: the resulting employee model data includes the *unfiltered* orders
      // since we cannot filter orders by a callback function via `resolver`
      // since it is indented to be executed on a graphql request
      // and it *does not* accept callback functions as an argument
      const employee = await this.employeeResolver.employee({
        id: employeeListData.id,
      });
      const orders = employee.orders ?? [];
      employees.push({
        ...employee,
        // retrieve the correct filtered orders for the employee
        // since we cannot filter orders with a callback function via a resolver
        orders: orders.filter((order) => {
          return employeeListData.orderIds.includes(order.id);
        }) as Order[],
        spendingBreakdown: employeeListData.spendingBreakdown,
      });
    }
    return Promise.resolve({
      ...company,
      employees,
    } as CompanyEmployeeSpendingBreakdown);
  }
}
