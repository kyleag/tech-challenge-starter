import { CompanyRawEmployeeOrderList } from './company-raw-employee-order-list';
export interface CompanyRawEmployeeOrderSpendingBreakdownList
  extends CompanyRawEmployeeOrderList {
  spendingBreakdown: {
    total: number;
    taxFree: number;
    taxable: number;
    netSalary: number;
  };
}
