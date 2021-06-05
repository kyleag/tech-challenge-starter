import companies from '@data/companies';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { CompanyRaw } from './dto/company.raw';

@Injectable()
export class CompanyService extends FileSourceDatabaseService<CompanyRaw> {
  constructor() {
    super(companies);
  }
}
