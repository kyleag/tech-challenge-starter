import { CompanyRawEmployeeOrderList } from './company-raw-employee-order-list';
import { CompanyRaw } from './company.raw';

export interface CompanyEmployeesOfRemainingBudgetResponse extends CompanyRaw {
  employees: CompanyRawEmployeeOrderList[];
}
