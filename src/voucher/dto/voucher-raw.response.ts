import { VoucherRaw } from './voucher.raw';

export interface VoucherRawResponse extends VoucherRaw {
  orderIds: number[];
}
