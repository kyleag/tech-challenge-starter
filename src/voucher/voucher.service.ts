import vouchers from '@data/vouchers';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { OrderService } from '@src/order/order.service';
import { VoucherRawResponse } from './dto/voucher-raw.response';
import { VoucherRaw } from './dto/voucher.raw';

@Injectable()
export class VoucherService extends FileSourceDatabaseService<VoucherRaw> {
  constructor(private readonly orderService: OrderService) {
    super(vouchers);
  }

  getAll(): VoucherRawResponse[] {
    const vouchersRaw = super.getAll();
    return vouchersRaw.map((voucherRaw) => {
      // retrieve related orders
      const ordersRaw = this.orderService.getAll({
        voucherId: voucherRaw.id,
      });
      return {
        ...voucherRaw,
        orderIds: ordersRaw.map((order) => order.id),
      };
    });
  }
}
