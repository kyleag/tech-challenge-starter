import companies from '@data/companies';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { Company } from './company.model';

@Injectable()
export class CompanyService extends FileSourceDatabaseService<Company> {
  constructor() {
    super(companies);
  }
}
