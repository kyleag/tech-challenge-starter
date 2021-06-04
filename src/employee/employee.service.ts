import employees from '@data/employees';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { CompanyService } from '@src/company/company.service';
import { Employee } from './employee.model';

// represents a raw employee data (without the related `Company`)
interface RawEmployee extends Pick<Employee, 'id' | 'name' | 'budget'> {
  companyId: number;
}

@Injectable()
export class EmployeeService extends FileSourceDatabaseService<Employee> {
  constructor(private readonly companyService: CompanyService) {
    super(employees);
  }
  getAll(): Employee[] {
    const results = this.records as RawEmployee[];

    // map employee's companies
    return results.map(({ companyId, ...employee }) => {
      return {
        ...employee,
        // @TODO: cache or save in a map to avoid re-retrieving already retrieved ones?
        // @TODO: move the mapping of related models to base service?
        company: this.companyService.getById(companyId),
      } as Employee;
    });
  }
}
