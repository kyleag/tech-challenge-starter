import employees from '@data/employees';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { EmployeeRaw } from './dto/employee.raw';

@Injectable()
export class EmployeeService extends FileSourceDatabaseService<EmployeeRaw> {
  constructor() {
    super(employees);
  }
}
