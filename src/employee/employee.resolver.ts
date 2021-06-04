import { Query, Resolver } from '@nestjs/graphql';
import { Employee } from './employee.model';
import { EmployeeService } from './employee.service';

@Resolver('Employee')
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  @Query(() => [Employee])
  employees(): Employee[] {
    return this.employeeService.getAll();
  }
}
