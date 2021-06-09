import { VoucherRaw } from './voucher.raw';

export interface VoucherRawResponse extends VoucherRaw {
  revenue: number;
  orderIds: number[];
}
