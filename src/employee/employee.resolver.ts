import { Args, Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from '@src/company/company.service';
import { OrderResolver } from '@src/order/order.resolver';
import { EmployeeFilterArgs } from './dto/employee-filter.args';
import { Employee } from './employee.model';
import { EmployeeService } from './employee.service';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,
    private readonly orderResolver: OrderResolver,
  ) {}

  @Query(() => [Employee])
  async employees(
    @Args() { orders = {}, ...filters }: EmployeeFilterArgs = {},
  ): Promise<Employee[]> {
    const rawEmployees = this.employeeService.getAll(filters);
    const employees: Employee[] = [];
    for (const rawEmployee of rawEmployees) {
      const { companyId, ...employee } = rawEmployee;
      employees.push({
        ...employee,
        // @TODO - use `ResolveField`?
        // doing this since testing this method *DOES NOT* automatically resolve the fields that need to be resolved
        // and it seems like the `ResolveField` only works when doing an actual graphql query
        company: await this.companyService.getById(companyId),
        orders: await this.orderResolver.orders({
          ...orders,
          employeeId: employee.id,
        }),
      } as Employee);
    }
    return employees;
  }
}
