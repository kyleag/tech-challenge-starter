import companies from '@data/companies';
import { Test, TestingModule } from '@nestjs/testing';
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from '@src/common/helpers/date-helper';
import { taxFactory } from '@src/common/helpers/tax-helper';
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
      const month = 1; // january
      const year = 2020;
      const result: Company[] =
        await companyResolver.companiesEmployeesOfRemaingBudget({
          budget,
          month,
          year,
        });

      // get a company to check the results
      // based on the static data, company `1` will yield a result with 1 employee and 1 order
      const resultToCheck = result
        .filter((company) => company.id === 1)
        .shift() as Company;
      expect(resultToCheck.employees).not.toBeUndefined();
      expect(resultToCheck.employees).toHaveLength(1);

      const dateFrom = `${year}-${month}-01`;
      for (const employee of resultToCheck?.employees ?? []) {
        // retrieve a list of orders for the current employee in the specified month, year
        const orders = await orderResolver.orders({
          employeeId: employee.id,
          date: {
            from: dateFrom,
            to: getLastDayOfMonth(new Date(dateFrom)).toString(),
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

  describe('retrieve a list of employees (including the spending breakdown) for a certain company', () => {
    it('should retrieve employees with spending for a certain company', async () => {
      // data to check is based on the provided static data that will yield the results that can be used to test
      // if the calculation works
      const companyIdToCheck = 1;
      const month = 1;
      const year = 2020;
      const result = await companyResolver.companyEmployeesSpendingBreakdown({
        id: companyIdToCheck,
        month,
        year,
      });

      const dateFrom = `${year}-${month}-01`;
      for (const employee of result.employees) {
        const orders = (
          await orderResolver.orders({
            employeeId: employee.id,
            date: {
              from: dateFrom,
              to: getLastDayOfMonth(new Date(dateFrom)).toString(),
            },
          })
        ).sort((first, second) => {
          // make sure to sort by date
          return first.date < second.date ? 1 : 0;
        });

        // calculate the spending breakdown manually
        const budget = employee.budget;
        const spendingBreakdown = orders.reduce(
          (breakdown, order) => {
            const amount = order.voucher.amount;

            // always increment the total with the amount
            breakdown.total += amount;

            // instantiate the corresponding tax rule
            const taxType = taxFactory(order.voucher.taxType);

            // make sure tax free wont exceed the budget
            if (breakdown.taxFree !== budget) {
              // make sure to only add amount that wont exceed the budget
              // excess should be added as taxable
              if (breakdown.taxFree + amount <= budget) {
                breakdown.taxFree += amount;
              } else {
                const excess = breakdown.taxFree + amount - budget;
                breakdown.taxFree = budget;
                breakdown.taxable = excess;

                // deduct the tax amount of the excess to the salary
                breakdown.netSalary -= taxType.calculate(excess);
              }
            } else {
              // add amounts as taxable if budget has been exhausted
              // then also deduct the tax amount to the net salary
              breakdown.taxable += amount;
              breakdown.netSalary -= taxType.calculate(amount);
            }
            return breakdown;
          },
          {
            total: 0,
            taxFree: 0,
            taxable: 0,
            netSalary: employee.salary,
          },
        );

        // check the calculated breakdown against the result
        expect(employee.spendingBreakdown).toEqual(spendingBreakdown);
      }
    });
  });
});
