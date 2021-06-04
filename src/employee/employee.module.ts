import { Module } from '@nestjs/common';
import { CompanyService } from '@src/company/company.service';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeService } from './employee.service';

@Module({
  providers: [EmployeeResolver, EmployeeService, CompanyService],
})
export class EmployeeModule {}
