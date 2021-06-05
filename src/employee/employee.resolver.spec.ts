import employees from '@data/employees';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '@src/company/company.service';
import { Employee } from './employee.model';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';

describe(EmployeeResolver.name, () => {
  let employeeResolver: EmployeeResolver;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [EmployeeResolver, EmployeeService, CompanyService],
    }).compile();

    employeeResolver = moduleRef.get<EmployeeResolver>(EmployeeResolver);
  });

  describe('get all employees', () => {
    let results: Employee[];
    it('should return all employees', () => {
      results = employeeResolver.employees();
      expect(results.length).toStrictEqual(employees.length);
      results.forEach((result, index) => {
        expect(result.id).toStrictEqual(employees[index].id);
      });
    });

    it('should correctly retrieve the related company', () => {
      // check the last item of both the employee data and the result
      const employeeToCheck = [...employees].slice(-1).pop();
      const resultToCheck = [...results].slice(-1).pop();
      expect(resultToCheck?.company.id).toStrictEqual(
        employeeToCheck?.companyId,
      );
    });
  });
});
