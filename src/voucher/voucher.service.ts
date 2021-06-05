import vouchers from '@data/vouchers';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { Voucher } from './voucher.model';

@Injectable()
export class VoucherService extends FileSourceDatabaseService<Voucher> {
  constructor() {
    super(vouchers);
  }
}
