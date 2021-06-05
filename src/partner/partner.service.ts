import partners from '@data/partners';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { PartnerRaw } from './dto/partner.raw';

@Injectable()
export class PartnerService extends FileSourceDatabaseService<PartnerRaw> {
  constructor() {
    super(partners);
  }
}
