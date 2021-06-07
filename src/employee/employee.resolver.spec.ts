import employees from '@data/employees';
import orders from '@data/orders';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '@src/company/company.service';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { PartnerResolver } from '@src/partner/partner.resolver';
import { PartnerService } from '@src/partner/partner.service';
import { VoucherResolver } from '@src/voucher/voucher.resolver';
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
        VoucherResolver,
        PartnerService,
        PartnerResolver,
      ],
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
