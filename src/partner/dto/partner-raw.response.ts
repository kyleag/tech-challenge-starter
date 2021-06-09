import { PartnerRaw } from './partner.raw';

export interface PartnerRawResponse extends PartnerRaw {
  revenue: number;
  voucherIds: number[];
}
