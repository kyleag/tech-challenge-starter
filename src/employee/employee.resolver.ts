import { Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from '@src/company/company.service';
import { OrderResolver } from '@src/order/order.resolver';
import { EmployeeRaw } from './dto/employee.raw';
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
  employees(filters: Partial<EmployeeRaw>): Employee[] {
    return this.employeeService
      .getAll(filters)
      .map(({ companyId, ...employee }) => {
        return {
          ...employee,
          // @TODO - use `ResolveField`?
          // doing this since testing this method *DOES NOT* automatically resolve the fields that need to be resolved
          // and it seems like the `ResolveField` only works when doing an actual graphql query
          company: this.companyService.getById(companyId),
          orders: this.orderResolver.orders({
            employeeId: employee.id,
          }),
        } as Employee;
      });
  }
}
