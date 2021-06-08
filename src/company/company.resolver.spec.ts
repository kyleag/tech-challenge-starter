import companies from '@data/companies';
import { Test, TestingModule } from '@nestjs/testing';
import { EMPLOYEE_MAXIMUM_NONTAXABLE_BUDGET } from '@src/common/constants/budget';
import { getFirstDayOfMonth } from '@src/common/helpers/date-helper';
import { EmployeeResolver } from '@src/employee/employee.resolver';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderResolver } from '@src/order/order.resolver';
import { OrderService } from '@src/order/order.service';
import { PartnerResolver } from '@src/partner/partner.resolver';
import { PartnerService } from '@src/partner/partner.service';
import { VoucherResolver } from '@src/voucher/voucher.resolver';
import { VoucherService } from '@src/voucher/voucher.service';
import { Company } from './company.model';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';

describe(CompanyResolver.name, () => {
  let companyResolver: CompanyResolver;
  let orderResolver: OrderResolver;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        // @TODO - import `EmployeeModule` instead?
        // can't seem to make it work, though
        // sticking with this approach for now
        CompanyService,
        CompanyResolver,
        EmployeeResolver,
        EmployeeService,
        OrderResolver,
        OrderService,
        VoucherService,
        VoucherResolver,
        PartnerService,
        PartnerResolver,
      ],
    }).compile();

    companyResolver = moduleRef.get<CompanyResolver>(CompanyResolver);
    orderResolver = moduleRef.get<OrderResolver>(OrderResolver);
  });

  describe('get all companies', () => {
    it('should return all companies', async () => {
      const results = await companyResolver.companies();
      expect(results.length).toStrictEqual(companies.length);
      results.forEach((result, index) => {
        expect(result.id).toStrictEqual(companies[index].id);
      });
    });
    it('should return all companies based on filter criteria', async () => {
      const title = 'Moon Inc.';
      const results = await companyResolver.companies({
        // @TODO - currently only supports direct equality
        title,
      });
      results.forEach((result) => {
        expect(result.title).toStrictEqual(title);
      });
    });
    it('should return all filtered orders by date range for employees under the companies', async () => {
      const dateFrom = '2020-02-01';
      const dateTo = '2020-02-29';
      const results = await companyResolver.companies({
        employees: {
          orders: {
            date: {
              from: dateFrom,
              to: dateTo,
            },
          },
        },
      });
      results.forEach((company) => {
        company.employees?.forEach((employee) => {
          expect(
            employee.orders?.every((order) => {
              return (
                new Date(dateFrom) <= order.date &&
                order.date <= new Date(dateTo)
              );
            }),
          ).toBe(true);
        });
      });
    });
  });

  describe('get a list of employees of specified remaining budget per company', () => {
    it('should retrieve a list of employees for the current month of a specific budget', async () => {
      const budget = 10;
      const results: Company[] =
        await companyResolver.companiesEmployeesOfRemaingBudget({
          budget,
        });
      const resultToCheck = [...results].slice(-1).pop();
      for (const employee of resultToCheck?.employees ?? []) {
        // retrieve a list of orders for the current employee in the current month
        const orders = await orderResolver.orders({
          employeeId: employee.id,
          date: {
            from: getFirstDayOfMonth().toString(),
          },
        });
        const total = orders.reduce((accumulator, current) => {
          accumulator += current.voucher.amount;
          return accumulator;
        }, 0);
        const remaining = employee.budget - total;
        expect(remaining).toBeGreaterThan(budget);
      }
    });
    it('should retrieve a list of employees for specified month, year of a specific budget', async () => {
      const budget = 10;
      const results: Company[] =
        await companyResolver.companiesEmployeesOfRemaingBudget({
          budget,
          month: 1,
          year: 2020,
        });
      const resultToCheck = [...results].slice(-1).pop();
      for (const employee of resultToCheck?.employees ?? []) {
        // retrieve a list of orders for the current employee in the current month
        const orders = await orderResolver.orders({
          employeeId: employee.id,
          date: {
            from: getFirstDayOfMonth().toString(),
          },
        });
        const total = orders.reduce((accumulator, current) => {
          accumulator += current.voucher.amount;
          return accumulator;
        }, 0);
        const remaining = employee.budget - total;
        expect(remaining).toBeGreaterThan(budget);
      }
    });
  });
});
