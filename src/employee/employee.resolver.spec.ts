import employees from '@data/employees';
import orders from '@data/orders';
import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyModule } from '@src/company/company.module';
import { CompanyService } from '@src/company/company.service';
import { OrderModule } from '@src/order/order.module';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { VoucherService } from '@src/voucher/voucher.service';
import { Employee } from './employee.model';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';

describe(EmployeeResolver.name, () => {
  let employeeResolver: EmployeeResolver;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeResolver,
        EmployeeService,
        CompanyService,
        OrderResolver,
        OrderService,
        VoucherService,
      ],
      imports: [forwardRef(() => CompanyModule), forwardRef(() => OrderModule)],
    }).compile();

    employeeResolver = moduleRef.get<EmployeeResolver>(EmployeeResolver);
  });

  describe('get all employees', () => {
    let results: Employee[];
    it('should return all employees', async () => {
      results = await employeeResolver.employees();
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

    it('should correctly retrieve the related orders', () => {
      // check the last item of both the employee data and the result
      const employeeToCheck = [...employees].slice(-1).pop();
      const resultToCheck = [...results].slice(-1).pop();
      const ordersToCheck = orders.filter(
        (order) => order.employeeId === employeeToCheck?.id,
      );
      resultToCheck?.orders?.forEach((resultingOrder) => {
        expect(ordersToCheck.map((order) => order.id)).toContain(
          resultingOrder.id,
        );
      });
    });
  });
});
