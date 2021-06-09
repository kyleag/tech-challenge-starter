import { Args, Query, Resolver } from '@nestjs/graphql';
import { Order } from '@src/order/order.model';
import { OrderResolver } from '@src/order/order.resolver';
import { PartnerResolver } from '@src/partner/partner.resolver';
import { VoucherFilterArgs } from './dto/voucher-filter-args';
import { Voucher } from './voucher.model';
import { VoucherService } from './voucher.service';

@Resolver(() => Voucher)
export class VoucherResolver {
  constructor(
    private readonly voucherService: VoucherService,
    private readonly partnerResolver: PartnerResolver,
    private readonly orderResolver: OrderResolver,
  ) {}

  @Query(() => [Voucher])
  async vouchers(@Args() filter: VoucherFilterArgs = {}): Promise<Voucher[]> {
    const vouchersRaw = this.voucherService.getAll(filter);
    const vouchers: Voucher[] = [];
    for (const { partnerId, orderIds, ...voucher } of vouchersRaw) {
      const orders: Order[] = [];
      for (const orderId of orderIds) {
        const order = await this.orderResolver.order({
          id: orderId,
        });
        orders.push(order);
      }
      vouchers.push({
        ...voucher,
        orders,
        partner: this.partnerResolver.partner({
          id: partnerId,
        }),
      });
    }
    return vouchers;
  }
}
