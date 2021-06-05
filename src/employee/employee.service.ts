import employees from '@data/employees';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { Employee } from './employee.model';

@Injectable()
export class EmployeeService extends FileSourceDatabaseService<Employee> {
  constructor() {
    super(employees);
  }
}
