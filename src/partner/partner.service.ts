import partners from '@data/partners';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { Partner } from './partner.model';

@Injectable()
export class PartnerService extends FileSourceDatabaseService<Partner> {
  constructor() {
    super(partners);
  }
}
