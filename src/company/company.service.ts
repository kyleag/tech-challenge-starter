import MOCK_COMPANIES from '@data/companies';
import { Injectable } from '@nestjs/common';
import { Company } from './company.model';

@Injectable()
export class CompanyService {
  getAll(): Company[] {
    return MOCK_COMPANIES;
  }
}
