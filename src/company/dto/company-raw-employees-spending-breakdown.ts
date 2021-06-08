import { CompanyRawEmployeeOrderSpendingBreakdownList } from './company-raw-employee-order-spending-breakdown-list';
import { CompanyRaw } from './company.raw';

export interface CompanyRawEmployeesSpendingBreakdown extends CompanyRaw {
  employees: CompanyRawEmployeeOrderSpendingBreakdownList[];
}
