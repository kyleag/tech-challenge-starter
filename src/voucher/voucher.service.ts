import vouchers from '@data/vouchers';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { VoucherRaw } from './dto/voucher.raw';

@Injectable()
export class VoucherService extends FileSourceDatabaseService<VoucherRaw> {
  constructor() {
    super(vouchers);
  }
}
