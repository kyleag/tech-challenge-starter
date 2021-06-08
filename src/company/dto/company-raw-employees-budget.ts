import { CompanyRawEmployeeOrderList } from './company-raw-employee-order-list';
import { CompanyRaw } from './company.raw';

export interface CompanyRawEmployeesOfRemainingBudget extends CompanyRaw {
  employees: CompanyRawEmployeeOrderList[];
}
