import companies from '@data/companies';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderService } from '@src/order/order.service';
import { VoucherService } from '@src/voucher/voucher.service';
import { CompanyRawEmployeesOfRemainingBudget } from './dto/company-raw-employees-budget';
import { CompanyFilterArgs } from './dto/company-filter.args';
import { CompanyRawEmployeeOrderList } from './dto/company-raw-employee-order-list';
import { CompanyRaw } from './dto/company.raw';
import { CompanyRawEmployeesSpendingBreakdown } from './dto/company-raw-employees-spending-breakdown';
import { getLastDayOfMonth } from '@src/common/helpers/date-helper';
import { CompanyRawEmployeeOrderSpendingBreakdownList } from './dto/company-raw-employee-order-spending-breakdown-list';
import { taxFactory } from '@src/common/helpers/tax-helper';

interface GetAllCompaniesEmployeesOfRemainingBudgetArgs
  extends Partial<Omit<CompanyFilterArgs, 'employees'>> {
  budget: number;
  dateFrom: string;
  dateTo: string;
}

interface GetCompanyEmployeesSpendingBreakdownArgs {
  id: number;
  dateFrom: string;
}

@Injectable()
export class CompanyService extends FileSourceDatabaseService<CompanyRaw> {
  constructor(
    private readonly orderService: OrderService,
    private readonly employeeService: EmployeeService,
    private readonly voucherService: VoucherService,
  ) {
    super(companies);
  }
  getAllCompaniesEmployeesOfRemainingBudget({
    budget,
    dateFrom,
    dateTo,
    ...companyFilters
  }: GetAllCompaniesEmployeesOfRemainingBudgetArgs): CompanyRawEmployeesOfRemainingBudget[] {
    // get related employees first
    const employees = this.employeeService.getAll({
      companyId: companyFilters.id,
    });

    // get related orders
    const orders = this.orderService.getAll({
      employeeId: (employeeId: number) => {
        return employees.map((employee) => employee.id).includes(employeeId);
      },
      date: {
        from: dateFrom,
        to: dateTo,
      },
    });
    return this.getAll(companyFilters).map((company) => {
      return {
        ...company,
        employees: employees
          .filter((employee) => employee.companyId === company.id)
          .reduce((employeeList, employee) => {
            // get orders under the current employee
            const employeeOrders = orders.filter(
              (order) => order.employeeId === employee.id,
            );
            const total = employeeOrders.reduce((acc, curr) => {
              const amount = this.voucherService.getById(curr.voucherId).amount;
              acc += amount;
              return acc;
            }, 0);
            const remaining = employee.budget - total;
            if (remaining > budget) {
              employeeList.push({
                id: employee.id,
                orderIds: employeeOrders.map((order) => order.id),
              });
            }
            return employeeList;
          }, [] as CompanyRawEmployeeOrderList[]),
      } as CompanyRawEmployeesOfRemainingBudget;
    });
  }

  getCompanyEmployeesSpendingBreakdown({
    id,
    dateFrom,
  }: GetCompanyEmployeesSpendingBreakdownArgs): CompanyRawEmployeesSpendingBreakdown {
    // get related employees first
    const employees = this.employeeService.getAll({
      companyId: id,
    });

    // get related orders
    const dateTo = getLastDayOfMonth(new Date(dateFrom)).toString();
    const orders = this.orderService.getAll({
      employeeId: (employeeId: number) => {
        return employees.map((employee) => employee.id).includes(employeeId);
      },
      date: {
        from: dateFrom,
        to: dateTo,
      },
    });
    const companyRaw = this.getById(id);
    return {
      ...companyRaw,
      employees: employees.reduce((employeeList, employee) => {
        // get orders under the current employee
        const employeeOrders = orders.filter(
          (order) => order.employeeId === employee.id,
        );
        const budget = employee.budget;
        const spendingBreakdown = employeeOrders.reduce(
          (breakdown, order) => {
            const { amount, taxType: taxTypeName } =
              this.voucherService.getById(order.voucherId);

            // always increment the total with the amount
            breakdown.total += amount;

            // instantiate the corresponding tax rule
            const taxType = taxFactory(taxTypeName);

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
        employeeList.push({
          id: employee.id,
          orderIds: employeeOrders.map((order) => order.id),
          spendingBreakdown,
        });
        return employeeList;
      }, [] as CompanyRawEmployeeOrderSpendingBreakdownList[]),
    } as CompanyRawEmployeesSpendingBreakdown;
  }
}
