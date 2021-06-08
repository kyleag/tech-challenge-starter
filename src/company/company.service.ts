import companies from '@data/companies';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { EmployeeService } from '@src/employee/employee.service';
import { OrderService } from '@src/order/order.service';
import { VoucherService } from '@src/voucher/voucher.service';
import { CompanyEmployeesOfRemainingBudgetResponse } from './dto/company-employees-budget.response';
import { CompanyFilterArgs } from './dto/company-filter.args';
import { CompanyRawEmployeeOrderList } from './dto/company-raw-employee-order-list';
import { CompanyRaw } from './dto/company.raw';

interface GetAllCompaniesEmployeesOfRemainingBudgetArgs
  extends Partial<Omit<CompanyFilterArgs, 'employees'>> {
  budget: number;
  dateFrom: string;
  dateTo: string;
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
  }: GetAllCompaniesEmployeesOfRemainingBudgetArgs): CompanyEmployeesOfRemainingBudgetResponse[] {
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
      } as CompanyEmployeesOfRemainingBudgetResponse;
    });
  }
}
